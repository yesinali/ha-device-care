"""Isolated Home Assistant lifecycle smoke test (run manually, never on user data).

Requires the Home Assistant version under test and its dependencies. This starts
HA in a temporary config directory and uses an empty network-adapter stub because
some sandbox/container environments cannot enumerate interfaces.
"""

from __future__ import annotations

import asyncio
import os
import sys
import tempfile
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import ifaddr

ifaddr.get_adapters = lambda: []  # type: ignore[assignment]

from homeassistant.bootstrap import async_setup_hass
from homeassistant.components import frontend
from homeassistant.runner import RuntimeConfig


class Connection:
    def __init__(self, is_admin: bool) -> None:
        self.user = SimpleNamespace(is_admin=is_admin)
        self.subscriptions: dict[int, object] = {}
        self.results: list[tuple[int, dict]] = []
        self.errors: list[tuple] = []
        self.events: list[tuple[int, dict]] = []

    def send_result(self, msg_id: int, result: dict) -> None:
        self.results.append((msg_id, result))

    def send_error(self, *error: object) -> None:
        self.errors.append(error)

    def send_event(self, msg_id: int, event: dict) -> None:
        self.events.append((msg_id, event))


async def main() -> None:
    integration = Path(__file__).resolve().parents[1] / "custom_components" / "device_care"
    with tempfile.TemporaryDirectory(prefix="ha-device-care-runtime-") as temp_dir:
        config_dir = Path(temp_dir)
        custom_components = config_dir / "custom_components"
        custom_components.mkdir()
        (custom_components / "device_care").symlink_to(integration, target_is_directory=True)
        (config_dir / "configuration.yaml").write_text(
            "homeassistant:\n  name: Isolated QA\nhttp:\nfrontend:\nwebsocket_api:\n",
            encoding="utf-8",
        )
        sys.path.insert(0, str(config_dir))
        sys.path.insert(0, str(custom_components))
        hass = await async_setup_hass(RuntimeConfig(config_dir=str(config_dir), skip_pip=True))
        assert hass is not None
        await hass.async_start()
        print("HA runtime state", repr(hass.state), type(hass.state)); assert str(hass.state).lower().endswith("running")

        flow = await hass.config_entries.flow.async_init(
            "device_care", context={"source": "user"}
        )
        assert flow["step_id"] == "user"
        flow = await hass.config_entries.flow.async_configure(
            flow["flow_id"], {"scope": "all", "auto_include_new": True}
        )
        assert flow["step_id"] == "confirm"
        result = await hass.config_entries.flow.async_configure(
            flow["flow_id"], {"confirm": True}
        )
        assert result["type"] == "create_entry"
        entry = hass.config_entries.async_entries("device_care")[0]
        assert entry.state.name == "LOADED"
        panels = hass.data.get(frontend.DATA_PANELS, {})
        assert "device-care" in panels and panels["device-care"].require_admin

        from device_care.websocket_api import (
            ws_call_entity,
            ws_get_data,
            ws_get_report,
            ws_set_preferences,
            ws_subscribe,
        )

        guest = Connection(is_admin=False)
        ws_get_data(hass, guest, {"id": 1, "type": "device_care/get_data"})
        ws_get_report(
            hass, guest, {"id": 2, "type": "device_care/get_report", "window": "24h"}
        )
        await hass.async_block_till_done()
        assert len(guest.errors) == 2

        from homeassistant.helpers import entity_registry
        current_entity = SimpleNamespace(domain="switch", entity_category="config")
        current_state = SimpleNamespace(state="unavailable", attributes={})
        fake_registry = SimpleNamespace(async_get=lambda _entity_id: current_entity)
        service_calls: list[tuple] = []

        async def fake_async_call(*args, **kwargs):
            service_calls.append((args, kwargs))

        fake_hass = SimpleNamespace(
            states=SimpleNamespace(get=lambda _entity_id: current_state),
            services=SimpleNamespace(async_call=fake_async_call),
        )
        guest_control = Connection(is_admin=False)
        with patch.object(entity_registry, "async_get", return_value=fake_registry):
            await ws_call_entity.__wrapped__(
                fake_hass,
                guest_control,
                {"id": 20, "type": "device_care/call_entity", "entity_id": "switch.test_config", "service": "turn_on", "controls_unlocked": True},
            )
        assert guest_control.errors and "Administrator" in guest_control.errors[0][-1]
        locked_connection = Connection(is_admin=True)
        with patch.object(entity_registry, "async_get", return_value=fake_registry):
            await ws_call_entity.__wrapped__(
                fake_hass,
                locked_connection,
                {"id": 21, "type": "device_care/call_entity", "entity_id": "switch.test_config", "service": "turn_on"},
            )
        assert locked_connection.errors and "unlock" in locked_connection.errors[0][-1]
        state_connection = Connection(is_admin=True)
        with patch.object(entity_registry, "async_get", return_value=fake_registry):
            await ws_call_entity.__wrapped__(
                fake_hass,
                state_connection,
                {"id": 22, "type": "device_care/call_entity", "entity_id": "switch.test_config", "service": "turn_on", "controls_unlocked": True},
            )
        assert state_connection.errors and "unavailable" in state_connection.errors[0][-1]

        current_entity = SimpleNamespace(domain="switch", entity_category=None)
        current_state = SimpleNamespace(state="off", attributes={})
        config_connection = Connection(is_admin=True)
        with patch.object(entity_registry, "async_get", return_value=fake_registry):
            await ws_call_entity.__wrapped__(
                fake_hass,
                config_connection,
                {"id": 23, "type": "device_care/call_entity", "entity_id": "switch.test_config", "service": "turn_on", "controls_unlocked": True},
            )
        assert config_connection.errors and "CONFIG" in config_connection.errors[0][-1]

        current_entity = SimpleNamespace(domain="number", entity_category="config")
        current_state = SimpleNamespace(state="5", attributes={"min": 0, "max": 10, "step": 1})
        for request_id, invalid_value in enumerate((11, True, float("nan"), float("inf")), start=24):
            limits_connection = Connection(is_admin=True)
            with patch.object(entity_registry, "async_get", return_value=fake_registry):
                await ws_call_entity.__wrapped__(
                    fake_hass,
                    limits_connection,
                    {"id": request_id, "type": "device_care/call_entity", "entity_id": "number.test_config", "service": "set_value", "data": {"value": invalid_value}, "controls_unlocked": True},
                )
            assert limits_connection.errors and "limits" in limits_connection.errors[0][-1]
        assert service_calls == []

        current_entity = SimpleNamespace(domain="switch", entity_category="config")
        current_state = SimpleNamespace(state="off", attributes={})
        unlocked_connection = Connection(is_admin=True)
        with patch.object(entity_registry, "async_get", return_value=fake_registry):
            await ws_call_entity.__wrapped__(
                fake_hass,
                unlocked_connection,
                {"id": 28, "type": "device_care/call_entity", "entity_id": "switch.test_config", "service": "turn_on", "controls_unlocked": True},
            )
        assert unlocked_connection.results == [(28, {"success": True})]
        assert len(service_calls) == 1 and service_calls[0][0][0:3] == ("switch", "turn_on", {"entity_id": "switch.test_config"})

        admin = Connection(is_admin=True)
        ws_get_data(hass, admin, {"id": 3, "type": "device_care/get_data"})
        ws_get_report(
            hass, admin, {"id": 4, "type": "device_care/get_report", "window": "24h"}
        )
        await hass.async_block_till_done()
        assert len(admin.results) == 2
        data = admin.results[0][1]
        assert {"devices", "preferences", "capabilities"} <= data.keys()

        ws_subscribe(hass, admin, {"id": 5, "type": "device_care/subscribe_updates"})
        await hass.async_block_till_done()
        hass.bus.async_fire("device_care_device_care_updated", {"reason": "qa"})
        await hass.async_block_till_done()
        assert len(admin.events) == 1
        admin.subscriptions.pop(5)()
        event_count = len(admin.events)
        hass.bus.async_fire("device_care_device_care_updated", {"reason": "unsubscribed"})
        await hass.async_block_till_done()
        assert len(admin.events) == event_count

        ws_subscribe(hass, admin, {"id": 8, "type": "device_care/subscribe_updates"})
        ws_set_preferences(
            hass,
            admin,
            {
                "id": 6,
                "type": "device_care/set_preferences",
                "preferences": {"layout": "rooms"},
            },
        )
        await hass.async_block_till_done()
        assert 8 in admin.subscriptions
        assert await hass.config_entries.async_unload(entry.entry_id)
        assert entry.state.name == "NOT_LOADED"
        assert "device-care" not in hass.data.get(frontend.DATA_PANELS, {})
        assert not hass.data["device_care"]["entries"]
        assert 8 not in admin.subscriptions
        event_count = len(admin.events)
        hass.bus.async_fire("device_care_device_care_updated", {"reason": "unloaded"})
        await hass.async_block_till_done()
        assert len(admin.events) == event_count

        assert await hass.config_entries.async_setup(entry.entry_id)
        assert entry.state.name == "LOADED"
        assert "device-care" in hass.data.get(frontend.DATA_PANELS, {})
        admin_after_reload = Connection(is_admin=True)
        ws_get_data(
            hass,
            admin_after_reload,
            {"id": 7, "type": "device_care/get_data"},
        )
        await hass.async_block_till_done()
        assert admin_after_reload.results[0][1]["preferences"]["layout"] == "rooms"
        await hass.config_entries.async_unload(entry.entry_id)
        await hass.async_stop(force=True)
        print("PASS: HA bootstrap, config flow, admin WS, push unsubscribe, unload/reload, preferences")


if __name__ == "__main__":
    asyncio.run(main())
