/* Magic Mirror
 * Module: MMM-ShipmentTracking
 *
 * By fewieden https://github.com/fewieden/MMM-ShipmentTracking
 * MIT Licensed.
 */

const jsdom = require('jsdom');
const async = require('async');
const languages = ['de', 'en', 'fr', 'es', 'cs', 'pl', 'nl'];
const base_url = 'https://nolp.dhl.de/nextt-online-public/set_identcodes.do?';

exports.track = (ids, language) => {
    if(languages.indexOf(language) !== -1){
        language = 'en';
    }
    var result = {carrier: 'DHL', data: []};
    return new Promise((resolve, reject) => {
        async.each(ids, (id, callback) => {
            jsdom.env({
                url: base_url + 'lang=' + language + '&idc=' + id,
                done: function(err, window){
                    if(err){
                        result.push({error: 'Error ID: ' + id});
                        callback();
                    }
                    var status = window.document.querySelector("#collapseTwo0 table tbody tr:last-child td:last-child");
                    var date = window.document.querySelector("#collapseTwo0 table tbody tr:last-child td:first-child");
                    if(status && date){
                        status = status.textContent;
                        date = date.textContent.slice(-14);
                        result.data.push({
                            id: id,
                            date: '20' + date.substring(6, 8) + '-' + date.substring(3, 5) + '-' + date.substring(0, 2) + 'T' + date.slice(-5) + ':00+02:00',
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
                reject({error: "DHL: Error occurred!"});
            }
            resolve(result);
        });
    });
};
