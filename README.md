# MMM-ShipmentTracking  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/fewieden/MMM-ShipmentTracking/master/LICENSE) [![Build Status](https://travis-ci.org/fewieden/MMM-ShipmentTracking.svg?branch=master)](https://travis-ci.org/fewieden/MMM-ShipmentTracking) [![Code Climate](https://codeclimate.com/github/fewieden/MMM-ShipmentTracking/badges/gpa.svg?style=flat)](https://codeclimate.com/github/fewieden/MMM-ShipmentTracking) [![Known Vulnerabilities](https://snyk.io/test/github/fewieden/mmm-shipmenttracking/badge.svg)](https://snyk.io/test/github/fewieden/mmm-shipmenttracking)

Shipment Tracking Module for MagicMirror<sup>2</sup>

## Example

![](.github/example.jpg) ![](.github/example2.jpg)

## Dependencies

* An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
* npm
* [jsdom](https://www.npmjs.com/package/jsdom)
* [async](https://www.npmjs.com/package/async)
* [request](https://www.npmjs.com/package/request)

## Installation

1. Clone this repo into `~/MagicMirror/modules` directory.
1. Run command `npm install --productive` in `~/MagicMirror/modules/MMM-ShipmentTracking` directory, to install all dependencies. This will need a couple of minutes.
1. Configure your `~/MagicMirror/config/config.js`:

    ```
    {
        module: 'MMM-ShipmentTracking',
        position: 'top_right',
        config: {
            tracking: {
                DHL: ['0123456789123']
            },
            ...
        }
    }
    ```

## Available carriers

* [DHL](http://dhl.de) (tested with german tracking id, maybe it's worldwide)
* [Landmark](http://landmarkglobal.com)
* [17track](http://17track.net) Multicarrier (170+)

## Config Options

| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `tracking` | REQUIRED | Object of carriers with array of tracking ids |
| `format` | `false` | Displays relative date format, for absolute date format provide a string like `'DD:MM HH:mm'` [All Options](http://momentjs.com/docs/#/displaying/format/) |
| `updateInterval` | `3600000` (1 hour) | Interval new data should be fetched. |
