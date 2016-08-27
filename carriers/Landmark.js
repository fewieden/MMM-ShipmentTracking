/* Magic Mirror
 * Module: MMM-ShipmentTracking
 *
 * By fewieden https://github.com/fewieden/MMM-ShipmentTracking
 * MIT Licensed.
 */

const jsdom = require('jsdom');
const async = require('async');
const languages = ['en'];
const base_url = 'https://mercury.landmarkglobal.com/tracking/track.php?';

exports.track = (ids, language) => {
    if(languages.indexOf(language) !== -1){
        language = 'en';
    }
    var result = {carrier: 'Landmark', data: []};
    return new Promise((resolve, reject) => {
        async.each(ids, (id, callback) => {
            jsdom.env({
                url: base_url + 'trck=' + id + '&Submit=Track',
                done: function(err, window){
                    if(err){
                        result.push({error: 'Error ID: ' + id});
                        callback();
                    }
                    var status = window.document.querySelector("#container-0 div.current_status_information div");
                    var date = window.document.querySelector("#container-0 div.current_status_information span.time");
                    var timezone = window.document.querySelector("#time_zone");
                    if(status && date && timezone){
                        status = status.textContent.trim().substring(16);
                        date = date.textContent;
                        timezone = timezone.textContent;
                        result.data.push({
                            id: id,
                            date: date.substring(0,10) + 'T' + (date.slice(-2) === 'pm' ? ('0' + (12 + parseInt(date.substring(11,13))) + date.substring(13,16)).slice(-5) : date.substring(11,16)) + ':00' + timezone.slice(-6),
                            status: status
                        });
                    } else {
                        result.data.push({
                            id: id,
                            date: new Date(),
                            status: 'NO_DATA_ID'
                        });
                    }
                    window.close();
                    callback();
                }
            });
        }, (err) => {
            if( err ) {
                reject({error: "Landmark: Error occurred!"});
            }
            resolve(result);
        });
    });
};
