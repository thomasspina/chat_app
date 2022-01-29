const moment = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text, 
        date: moment().format('DD/MM/YY'),
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;