/* global Module Log moment config*/

/* Magic Mirror
 * Module: MMM-ShipmentTracking
 *
 * By fewieden https://github.com/fewieden/MMM-ShipmentTracking
 * MIT Licensed.
 */

Module.register('MMM-ShipmentTracking', {

    tracking: [],

    defaults: {
        format: false,
        updateInterval: 60 * 60 * 1000
    },

    start() {
        Log.info(`Starting module: ${this.name}`);
        this.config.language = config.language;
        moment.locale(config.language);
        this.sendSocketNotification('CONFIG', this.config);
    },

    getStyles() {
        return ['font-awesome.css', 'MMM-ShipmentTracking.css'];
    },

    getScripts() {
        return ['moment.js'];
    },

    getTranslations() {
        return {
            en: 'translations/en.json',
            de: 'translations/de.json'
        };
    },

    getDom() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('small', 'align-left');
        const header = document.createElement('header');
        const i = document.createElement('i');
        i.classList.add('fa', 'fa-truck', 'icon');
        const text = document.createElement('span');
        text.innerHTML = this.translate('SHIPMENT_TRACKING');
        header.appendChild(i);
        header.appendChild(text);
        wrapper.appendChild(header);

        const table = document.createElement('table');
        table.classList.add('table');
        table.appendChild(this.createLabelRow());
        const keys = Object.keys(this.tracking);
        if (keys.length) {
            for (let n = 0; n < keys.length; n += 1) {
                for (let x = 0; x < this.tracking[keys[n]].length; x += 1) {
                    this.appendData(keys[n], this.tracking[keys[n]][x], table);
                }
            }
        } else {
            const row = document.createElement('tr');
            const status = document.createElement('td');
            status.setAttribute('colspan', 3);
            status.innerHTML = this.translate('NO_DATA');
            row.appendChild(status);
            table.appendChild(row);
        }
        wrapper.appendChild(table);

        return wrapper;
    },

    socketNotificationReceived(notification, payload) {
        if (notification === 'DATA') {
            this.tracking[payload.carrier] = payload.data;
            this.updateDom(300);
        } else if (notification === 'ERROR') {
            Log.error(payload.error);
        }
    },

    createLabelRow() {
        const labelRow = document.createElement('tr');

        const carrierLabel = document.createElement('th');
        const carrierIcon = document.createElement('i');
        carrierIcon.classList.add('fa', 'fa-truck');
        carrierLabel.appendChild(carrierIcon);
        labelRow.appendChild(carrierLabel);

        const dateLabel = document.createElement('th');
        const dateIcon = document.createElement('i');
        dateIcon.classList.add('fa', 'fa-calendar');
        dateLabel.appendChild(dateIcon);
        labelRow.appendChild(dateLabel);

        const idLabel = document.createElement('th');
        const idIcon = document.createElement('i');
        idIcon.classList.add('fa', 'fa-tags');
        idLabel.appendChild(idIcon);
        labelRow.appendChild(idLabel);

        return labelRow;
    },

    appendData(carrier, data, table) {
        const row = document.createElement('tr');

        const carrierName = document.createElement('td');
        carrierName.innerHTML = carrier;
        row.appendChild(carrierName);

        const date = document.createElement('td');
        if (this.config.format) {
            date.innerHTML = moment(data.date).format(this.config.format);
        } else {
            date.innerHTML = moment(data.date).fromNow();
        }
        row.appendChild(date);

        const id = document.createElement('td');
        id.innerHTML = data.id;
        row.appendChild(id);

        table.appendChild(row);

        const subRow = document.createElement('tr');

        const status = document.createElement('td');
        status.setAttribute('colspan', 3);
        status.innerHTML = data.status === 'NO_DATA_ID' ? this.translate(data.status) : data.status;
        subRow.appendChild(status);

        table.appendChild(subRow);
    }
});
