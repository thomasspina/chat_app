const moment = require('moment');

function saveMessage(msg, room, db) {
    const getMessageInfoQuery = `SELECT
                                    r.room_id,
                                    u.user_id
                                FROM users u
                                JOIN rooms r ON r.name = '${room}'
                                WHERE u.name = '${msg.username}'`;
    db.query(getMessageInfoQuery, (err, res) => {
        if (err) throw err;

        const insertMessageQuery = `INSERT INTO messages
                                    VALUES (DEFAULT, 
                                            ${res[0].room_id}, 
                                            ${res[0].user_id}, 
                                            '${msg.text}', 
                                            '${msg.date + ' ' + msg.time}')`;

        db.query(insertMessageQuery, (err, res) =>{
            if (err) throw err;
            console.log(`message from ${msg.username} with text "${msg.text}" has been saved`)
        });
    });
}


function getMessages(room, offset, lim, db) {
    return new Promise((resolve, reject) => {
        const getMessagesQuery = `SELECT
                                    u.name AS username,
                                    m.message_text AS text,
                                    m.date_time AS time_stamp
                                FROM users u 
                                JOIN messages m USING(user_id)
                                JOIN rooms r ON r.room_id = m.room_id
                                WHERE r.name = '${room}'
                                ORDER BY m.message_id DESC
                                LIMIT ${offset}, ${lim}`;

        db.query(getMessagesQuery, (err, res) => {
            if (err) { return reject(err); }
            let formattedMessages = [];
            for (let i = 0; i < res.length; i++) {
                formattedMessages.push(formatMessage(res[i].username, res[i].text, res[i].time_stamp));
            }
            resolve(formattedMessages);
        });
    });
}


function formatMessage(username, text, timestamp = null) {
    if (timestamp !== null) {
        const date = `${timestamp.getFullYear()}-${timestamp.getMonth() + 1}-${timestamp.getDate()}`;
        const time = `${timestamp.getHours() > 9 ? '' : 0}${timestamp.getHours()}:${timestamp.getMinutes() > 9 ? '' : 0}${timestamp.getMinutes()}`;
        return {
            username, 
            text,
            date,
            time
        };
    }

    return {
        username,
        text, 
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('hh:mm')
    };
}

module.exports = { 
    formatMessage,
    saveMessage,
    getMessages
};