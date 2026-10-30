"""Custom panel registration and teardown."""
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig

from .const import DOMAIN, PANEL_ICON, PANEL_TITLE, VERSION


async def async_register_panel(hass) -> None:
    """Serve the packaged frontend and add its admin-only sidebar panel."""
    frontend_dir = Path(__file__).parent / "frontend"
    js_file = frontend_dir / "device-care.js"
    if not js_file.is_file():
        raise FileNotFoundError("Packaged device-care.js is missing; build frontend before install")
    route = f"/api/{DOMAIN}/static"
    if not hass.data.get("device_care_static_registered"):
        await hass.http.async_register_static_paths([StaticPathConfig(route, str(frontend_dir), True)])
        hass.data["device_care_static_registered"] = True
    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="device-care-panel",
        frontend_url_path="device-care",
        module_url=f"{route}/device-care.js?v={VERSION}",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        require_admin=True,
        config={},
    )


def async_unregister_panel(hass) -> None:
    """Remove sidebar registration when its config entry unloads."""
    frontend.async_remove_panel(hass, "device-care")
