/* Magic Mirror
 * Module: MMM-ShipmentTracking
 *
 * By fewieden https://github.com/fewieden/MMM-ShipmentTracking
 * MIT Licensed.
 */

/* eslint-env node */

const NodeHelper = require('node_helper');
const track = require('./Tracker.js')().track;

module.exports = NodeHelper.create({

    socketNotificationReceived(notification, payload) {
        if (notification === 'CONFIG') {
            this.config = payload;
            this.carriers = Object.keys(this.config.tracking);
            this.track();
            setInterval(() => {
                this.track();
            }, this.config.updateInterval);
        }
    },

    track() {
        for (let i = 0; i < this.carriers.length; i += 1) {
            track(this.carriers[i], this.config.tracking[this.carriers[i]], this.config.language)
            .then((result) => {
                if (Object.prototype.hasOwnProperty.call(result, 'error')) {
                    this.sendSocketNotification('ERROR', result);
                } else {
                    this.sendSocketNotification('DATA', result);
                }
            }).catch((result) => {
                this.sendSocketNotification('ERROR', result);
            });
        }
    }
});
