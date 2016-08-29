/* Magic Mirror
 * Module: MMM-ShipmentTracking
 *
 * By fewieden https://github.com/fewieden/MMM-ShipmentTracking
 * MIT Licensed.
 */

const request = require('request');
const async = require('async');
const status = {
    'bg': {'00': 'Не е намерено', '10': 'Транзит', '20': 'Изтекла', '30': 'Взета', '35': 'Недоставена', '40': 'Доставена', '50': 'Тревога'},
    'cs': {'00': 'Nenalezeno', '10': 'Přepravováno', '20': 'Vyřazeno', '30': 'Doručováno', '35': 'Nedoručeno', '40': 'Doručeno', '50': 'Upozornění'},
    'de': {'00': 'Nicht Gefunden', '10': 'In Transit', '20': 'Abgelaufen', '30': 'Abholung', '35': 'Nicht Zugestellt', '40': 'Zugestellt', '50': 'Alarm'},
    'el': {'00': 'Δε βρέθηκε', '10': "Καθ 'οδόν", '20': 'Έληξε', '30': 'Προς παράδοση', '35': 'Δεν έχει παραδοθεί', '40': 'Παραδόθηκε', '50': 'Προειδοποίηση'},
    'en': {'00': 'Not Found', '10': 'In Transit', '20': 'Expired', '30': 'Pick Up', '35': 'Undelivered', '40': 'Delivered', '50': 'Alert'},
    'es': {'00': 'No Encontrado', '10': 'En Tránsito', '20': 'Expirado', '30': 'Recogido', '35': 'No Entregado', '40': 'Entregado', '50': 'Alerta'},
    'fi': {'00': 'Ei löytynyt', '10': 'Kuljetuksessa', '20': 'Vanhentunut', '30': 'Noudettavissa', '35': 'Toimittamaton', '40': 'Toimitettu', '50': 'Varoitus'},
    'fr': {'00': 'Introuvable', '10': 'En Transit', '20': 'Expiré', '30': 'À récupérer', '35': 'Non Livré', '40': 'Livré', '50': 'Alerte'},
    'hu': {'00': 'Nem található', '10': 'Szállítás alatt', '20': 'Lejárt', '30': 'Átvétel', '35': 'Kézbesítetlen', '40': 'Kézbesítve', '50': 'Figyelmeztetés'},
    'it': {'00': 'Non Trovato', '10': 'In Transito', '20': 'Scaduto', '30': 'Prelevato', '35': 'Non Recapitato', '40': 'Consegnato', '50': 'Allerta'},
    'ja': {'00': '情報が見つかりません', '10': '輸送中', '20': '期限切れ', '30': '引受', '35': '未配達', '40': '配達完了', '50': '異常'},
    'kk': {'00': 'Табылмады', '10': 'Жолда', '20': 'Мерзімі аяқталды', '30': 'Қабылданды', '35': 'Жеткізілмеді', '40': 'Жеткізілді', '50': 'Хабарлама'},
    'ko': {'00': '찾을수 없음', '10': '운송중', '20': '만료됨', '30': '픽업', '35': '배송 실패', '40': '배송됨', '50': '알림'},
    'lt': {'00': 'Nerastas', '10': 'Tranzite', '20': 'Pasibaigęs', '30': 'Pasiimkite', '35': 'Nepristatyta', '40': 'Pristatyta', '50': 'Įspėjimas'},
    'nl': {'00': 'Niet Gevonden', '10': 'In Transport', '20': 'Verlopen', '30': 'Ophalen', '35': 'Levering mislukt', '40': 'Afgeleverd', '50': 'Melding'},
    'no': {'00': 'Ikke funnet', '10': 'Under transport', '20': 'Utgått', '30': 'Opphenting', '35': 'Ikke levert', '40': 'Levert', '50': 'Alarm'},
    'pl': {'00': 'Nie Znaleziono', '10': 'W Drodze', '20': 'Temin Upłynął', '30': 'Odbiór', '35': 'Niedoręczono', '40': 'Doręczono', '50': 'Ostrzeżenie'},
    'pt': {'00': 'Não Encontrado', '10': 'Em Trânsito', '20': 'Vencido', '30': 'Retirar', '35': 'Entrega Falhou', '40': 'Entregue', '50': 'Alerta'},
    'ro': {'00': 'Nu a fost găsit', '10': 'În tranzit', '20': 'Expirat', '30': 'Ridicare', '35': 'Nelivrat', '40': 'Livrat', '50': 'Alertă'},
    'ru': {'00': 'Не найдено', '10': 'В Пути', '20': 'Истек срок', '30': 'Получение', '35': 'Не доставлено', '40': 'Доставлено', '50': 'Проблема'},
    'sk': {'00': 'Nenájdené', '10': 'V preprave', '20': 'Vyradené', '30': 'Doručovaná', '35': 'Nedoručené', '40': 'Doručené', '50': 'Varovanie'},
    'sl': {'00': 'Ni zadetkov', '10': 'Na poti', '20': 'Poteklo', '30': 'Prevzem', '35': 'Nedostavljeno', '40': 'Dostavljeno', '50': 'Opozorilo'},
    'sq': {'00': 'Nuk u gjet', '10': 'Në tranzit', '20': 'Ka skaduar', '30': "Për t'u marrë", '35': 'Nuk u dorëzua', '40': 'U dorëzua', '50': 'Vëmendje'},
    'sr': {'00': 'Није нађен', '10': 'У транзиту', '20': 'Истекла', '30': 'Преузимање', '35': 'Није испоручена', '40': 'Испоручено', '50': 'Упозорење'},
    'sv': {'00': 'Inte Hittad', '10': 'Under Transport', '20': 'Utgått', '30': 'Hämta upp', '35': 'Ej levererat', '40': 'Levererat', '50': 'Varning'},
    'th': {'00': 'ไม่พบ', '10': 'อยู่ระหว่างการจัดส่ง', '20': 'หมดอายุ', '30': 'เตรียมนำจ่าย', '35': 'นำจ่ายไม่ได้', '40': 'ผู้รับได้รับแล้ว', '50': 'คำเตือน'},
    'tr': {'00': 'Bulunamadı', '10': 'Taşıma Halinde', '20': 'Geçmiş', '30': 'Dağıtımda/Teslim Alınabilir', '35': 'Ulaşmadı', '40': 'Teslim edildi', '50': 'Uyarı'},
    'uk': {'00': 'Не знайдено', '10': 'В дорозі', '20': 'Скінчився', '30': 'Отримання', '35': 'Не доставлено', '40': 'Доставлено', '50': 'Тривога'},
    'zh-cn': {'00': '查询不到', '10': '运输途中', '20': '运输过久', '30': '到达待取', '35': '投递失败', '40': '成功签收', '50': '可能异常'},
    'zh-hk': {'00': '查詢不到', '10': '運輸途中', '20': '運輸過久', '30': '到達待取', '35': '投遞失敗', '40': '成功簽收', '50': '可能異常'}
};
const base_url = 'http://www.17track.net/';

exports.track = (ids, language) => {
    if(!status.hasOwnProperty(language)){
        language = 'en';
    }
    var result = {carrier: '17track', data: []};
    return new Promise((resolve, reject) => {
        async.each(ids, (id, callback) => {
            var config = {
                method: 'POST',
                uri: 'http://www.17track.net/restapi/handlertrack.ashx',
                json: true,
                body: JSON.stringify({"guid":"","data":[{"num": id}]}),
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Origin': 'http://www.17track.net',
                    'Referer': 'http://www.17track.net/' + language + '/track?nums=' + id + '&fc=0',
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            request(config, (error, response, body) => {
                if (!error) {
                    var data = body.dat[0].track;
                    result.data.push({
                        id: id,
                        date: data.hasOwnProperty('z0') && data['z0'] ? data['z0'].a : new Date(),
                        status: status[language][('0' + data.e).slice(-2)]
                    });
                } else {
                    result.data.push({
                        id: id,
                        date: new Date(),
                        status: 'NO_DATA_ID'
                    });
                }
                callback();
            });
        }, (err) => {
            if( err ) {
                console.log(err);
                reject({error: "17track: Error occurred!"});
            }
            resolve(result);
        });
    });
};
