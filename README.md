## Compass
A compass and finder for mobile devices.

### Requirements
This application must be run on a mobile device with
* a forward (environment) facing camera
* a GPS/GNSS receiver
* a magnetometer for sensing magnetic direction
* XYZ orientation sensors

Most modern phones have all of these.

### Presentation

An azimuth and altitude grid at 15° intervals is displayed over a full screen video of the scene from the device's forward-facing camera.  The horizon (0° altitude) line has one-degree azimuth ticks labeled every five degrees.  Cardinal and intercardinal directions are labeled at the horizon and ±45° altitude.  The azimuth line for the current view direction also has one-degree altitude ticks labeled every five degrees.  All of these overlays track the movement of the device and scene.

### Use

Point the device in any direction to see the current azimuth and altitude of the scene.

### Planned features

* Calibration of the grid to the scene from the camera
* Set a location, see its bearing and distance
* Manage a list of locations

### Data Source

US National Oceanic and Atmospheric Administration
National Centers for Environmental Information
[World Magnetic Model (WMM) ](https://www.ncei.noaa.gov/products/world-magnetic-model)
