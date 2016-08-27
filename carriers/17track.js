/* Magic Mirror
 * Module: MMM-ShipmentTracking
 *
 * By fewieden https://github.com/fewieden/MMM-ShipmentTracking
 * MIT Licensed.
 */

const jsdom = require('jsdom');
const async = require('async');
const languages = [
    'de', 'en', 'fr', 'es', 'ru', 'pt', 'cs', 'zh-cn',
    'zh-hk', 'ja', 'ko', 'fi', 'pl', 'tr', 'it', 'nl',
    'uk', 'hu', 'sv', 'kk', 'el', 'th', 'bg', 'sk',
    'lt', 'ro', 'no', 'sq', 'sl', 'sr'
];
const base_url = 'http://www.17track.net/';

exports.track = (ids, language) => {
    if(languages.indexOf(language) !== -1){
        language = 'en';
    }
    var result = {carrier: '17track', data: []};
    return new Promise((resolve, reject) => {
            async.each(ids, (id, callback) => {
            jsdom.env({
            url: base_url + language + '/track?nums=' + id,
            done: function(err, window){
                if(err){
                    result.push({error: 'Error ID: ' + id});
                    callback();
                }
                var status = window.document.querySelector("#jsResultList section.jsResultBlock div.col-content p.track-infos span.flag-status");
                var date = window.document.querySelector("#jsResultList section.jsResultBlock div.col-summary div.result-summary time");
                if(status && date && timezone){
                    status = status.textContent;
                    date = date.textContent;
                    result.data.push({
                        id: id,
                        date: date.substring(0,10) + 'T' + date.slice(-5) + ':00+00:00',
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
            reject({error: "17track: Error occurred!"});
        }
        resolve(result);
    });
});
};
