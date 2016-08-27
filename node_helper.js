/* Magic Mirror
 * Module: MMM-ShipmentTracking
 *
 * By fewieden https://github.com/fewieden/MMM-ShipmentTracking
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const track = require('./Tracker.js')().track;

module.exports = NodeHelper.create({

    socketNotificationReceived: function(notification, payload){
        if(notification === 'CONFIG'){
            this.config = payload;
            this.carriers = Object.keys(this.config.tracking);
            this.track();
            setInterval(() => {
                this.track();
            }, this.config.updateInterval);
        }
    },

    track: function(){
        for(var i = 0; i < this.carriers.length; i++){
            track(this.carriers[i], this.config.tracking[this.carriers[i]], this.config.language)
            .then((result) => {
                if(result.hasOwnProperty('error')){
                    this.sendSocketNotification("ERROR", result);
                } else {
                    this.sendSocketNotification("DATA", result);
                }
            }).catch((result) => {
                this.sendSocketNotification("ERROR", result);
            });
        }
    }
});