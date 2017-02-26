/* Magic Mirror
 * Module: MMM-ShipmentTracking
 *
 * By fewieden https://github.com/fewieden/MMM-ShipmentTracking
 * MIT Licensed.
 */

/* eslint-env node */

const carriers = ['DHL', 'Landmark', '17track'];

module.exports = () => ({
    track(carrier, ids, language) {
        if (carriers.includes(carrier)) {
            // eslint-disable-next-line global-require, import/no-dynamic-require
            const track = require(`./carriers/${carrier}.js`).track;
            return new Promise((resolve, reject) => {
                track(ids, language)
                .then((res) => { resolve(res); })
                .catch((res) => { reject(res); });
            });
        }

        return new Promise((resolve, reject) => {
            reject({ error: 'Carrier is not supported!' });
        });
    }
});
