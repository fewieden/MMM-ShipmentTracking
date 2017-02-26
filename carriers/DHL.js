/* Magic Mirror
 * Module: MMM-ShipmentTracking
 *
 * By fewieden https://github.com/fewieden/MMM-ShipmentTracking
 * MIT Licensed.
 */

/* eslint-env node */

const jsdom = require('jsdom');
const async = require('async');

const languages = ['de', 'en', 'fr', 'es', 'cs', 'pl', 'nl'];
const defaultLanguage = 'en';
const baseUrl = 'https://nolp.dhl.de/nextt-online-public/set_identcodes.do';

exports.track = (ids, language) => {
    let useLanguage = language;
    if (languages.includes(useLanguage)) {
        useLanguage = defaultLanguage;
    }
    const result = { carrier: 'DHL', data: [] };
    return new Promise((resolve, reject) => {
        async.each(ids, (id, callback) => {
            jsdom.env({
                url: `${baseUrl}?lang=${useLanguage}&idc=${id}`,
                done(err, window) {
                    if (err) {
                        result.push({ error: `Error ID: ${id}` });
                        callback();
                    }
                    let status = window.document.querySelector('#collapseTwo0 table tbody tr:last-child td:last-child');
                    let date = window.document.querySelector('#collapseTwo0 table tbody tr:last-child td:first-child');
                    if (status && date) {
                        status = status.textContent;
                        date = date.textContent.slice(-14);
                        result.data.push({
                            id,
                            status,
                            date: `20${date.substring(6, 8)}-${date.substring(3, 5)}-${
                                date.substring(0, 2)}T${date.slice(-5)}`
                        });
                    } else {
                        result.data.push({
                            id,
                            date: new Date(),
                            status: 'NO_DATA_ID'
                        });
                    }
                    window.close();
                    callback();
                }
            });
        }, (err) => {
            if (err) {
                reject({ error: 'DHL: Error occurred!' });
            }
            resolve(result);
        });
    });
};
