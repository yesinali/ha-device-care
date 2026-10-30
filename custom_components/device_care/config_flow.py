"""UI setup and options flows."""
from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.helpers import selector

from .const import DOMAIN, PREFS_DEFAULT


class DeviceCareConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Create a local Device Care entry; no external credentials are used."""

    VERSION = 1

    def __init__(self):
        self._selection: dict = {}
        self._device_options: list[dict] = []

    async def async_step_user(self, user_input=None):
        if user_input is not None:
            await self.async_set_unique_id("local")
            self._abort_if_unique_id_configured()
            self._selection = {"scope": user_input["scope"], "auto_include_new": user_input["auto_include_new"]}
            if user_input["scope"] == "all":
                self._selection.update({"scope_value": None, "included_device_ids": None})
                self._selection["selected_count"] = len(self._all_devices())
                return await self.async_step_confirm()
            return await self.async_step_selection()
        schema = vol.Schema({
            vol.Required("scope", default="all"): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=["all", "area", "floor", "label", "integration", "manual"],
                    translation_key="device_scope",
                    mode=selector.SelectSelectorMode.DROPDOWN,
                )
            ),
            vol.Required("auto_include_new", default=True): bool,
        })
        return self.async_show_form(step_id="user", data_schema=schema)

    def _all_devices(self):
        from .discovery import build_inventory
        inventory = build_inventory(self.hass, {**PREFS_DEFAULT, "scope": "all", "excluded_device_ids": []})
        self._device_options = inventory["devices"]
        return self._device_options

    async def async_step_selection(self, user_input=None):
        scope = self._selection["scope"]
        inventory = self._all_devices()
        if scope == "manual":
            choices = [{"value": d["id"], "label": d["name"]} for d in inventory]
            field, multi = "included_device_ids", True
        else:
            key_by_scope = {"area": "areas", "floor": "floors", "label": "labels"}
            if scope in key_by_scope:
                choices = [{"value": item["id"], "label": item["name"]} for item in getattr(self, "_scope_inventory", {}).get(key_by_scope[scope], [])]
                if not choices:
                    from .discovery import build_inventory
                    self._scope_inventory = build_inventory(self.hass, {**PREFS_DEFAULT, "scope": "all", "excluded_device_ids": []})
                    choices = [{"value": item["id"], "label": item["name"]} for item in self._scope_inventory[key_by_scope[scope]]]
            else:
                choices = sorted({d["integration"] for d in inventory if d["integration"]})
                choices = [{"value": item, "label": item} for item in choices]
            field, multi = "scope_value", False
        if user_input is not None:
            selected = user_input[field]
            if scope == "manual":
                self._selection["included_device_ids"] = selected
                self._selection["scope_value"] = None
                count = len(selected)
            else:
                from .discovery import build_inventory
                self._selection["scope_value"] = selected
                self._selection["included_device_ids"] = None
                filters = {**PREFS_DEFAULT, **self._selection}
                count = len(build_inventory(self.hass, filters)["devices"])
            self._selection["selected_count"] = count
            return await self.async_step_confirm()
        if not choices:
            return self.async_abort(reason="no_scope_choices")
        config = selector.SelectSelectorConfig(options=choices, multiple=multi, mode=selector.SelectSelectorMode.DROPDOWN)
        return self.async_show_form(step_id="selection", data_schema=vol.Schema({vol.Required(field): selector.SelectSelector(config)}))

    async def async_step_confirm(self, user_input=None):
        if user_input is not None:
            payload = {key: value for key, value in self._selection.items() if key != "selected_count"}
            return self.async_create_entry(title="Device Care", data=payload)
        return self.async_show_form(step_id="confirm", data_schema=vol.Schema({vol.Required("confirm", default=True): bool}), description_placeholders={"count": str(self._selection.get("selected_count", 0))})

    @staticmethod
    def async_get_options_flow(config_entry):
        return DeviceCareOptionsFlow(config_entry)


class DeviceCareOptionsFlow(config_entries.OptionsFlow):
    """Options are kept in HA config-entry options and mirrored into storage."""

    def __init__(self, config_entry):
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)
        schema = vol.Schema({
            vol.Required("retention_days", default=self.config_entry.options.get("retention_days", 30)): vol.All(int, vol.Range(min=1, max=365)),
        })
        return self.async_show_form(step_id="init", data_schema=schema)
