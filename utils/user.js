function userJoin(socketId, username, room, db) {
    const connectUser = (query, resolve, param) => {
        db.query(query, (err, res) => { 
            if (err) { return reject(err); };
            console.log(`${username} has connected to ${room}`);
            resolve(param);
        });
    };

    return new Promise((resolve, reject) => {
        const user = { socketId, room, username }

        const fetchUserQuery = `SELECT * FROM users WHERE name = '${username}'`;
    
        const insertConnectedUsersQuery = `INSERT INTO connected_users  
                                            SELECT 
                                                u.user_id,
                                                r.room_id, 
                                                '${socketId}' AS socket_id 
                                            FROM users u
                                            JOIN rooms r
                                            WHERE u.name = '${username}' AND r.name = '${room}'`;
    
        db.query(fetchUserQuery, (err, res) => {
            if (err) { return reject(err); };
            
            if (res.length === 0) { // if no user insert new user
                db.query(`INSERT INTO users VALUES (DEFAULT, '${username}')`, (err, res) => {
                    if (err) { return reject(err); };
                    console.log(`created user ${username}.`);
                    connectUser(insertConnectedUsersQuery, resolve, user);
                });
            }
            else {
                // add connected user to connected db
                connectUser(insertConnectedUsersQuery, resolve, user);
            }
        });
    });
}

// get current user
function getCurrentUser(socketId, db) {
    return new Promise((resolve, reject) => {
        const fetchUserQuery = `SELECT 
                                    cu.socket_id AS socket,
                                    r.name AS room,
                                    u.name AS username
                                FROM users u
                                JOIN rooms r
                                JOIN connected_users cu ON cu.socket_id = '${socketId}'
                                WHERE u.user_id = cu.user_id AND r.room_id = cu.room_id`;

        db.query(fetchUserQuery, (err, res) => {
            if (err) { return reject(err); }
            const user = { id: res[0].socket, room: res[0].room, username: res[0].username };
            resolve(user);
        });
    });
}

// User leaves chat
function userLeave(socketId, db) {
    return new Promise((resolve, reject) => {
        const removeUserQuery = `DELETE FROM connected_users WHERE socket_id = '${socketId}'`;

        getCurrentUser(socketId, db)
        .then(user => {
            db.query(removeUserQuery, (err, res) => {
                if (err) { return reject(err); }
            });
            
            console.log(`${user.username} has disconnected from ${user.room}`)
            resolve(user);
        })
        .catch(err => { return reject(err); });
    });
}

// Get room users
function getRoomUsers(room, db) {
    return new Promise((resolve, reject) => {
        const getUsersQuery = `SELECT
                                    cu.socket_id AS socket,
                                    r.name AS room,
                                    u.name AS username
                                FROM connected_users cu
                                JOIN rooms r ON r.room_id = cu.room_id
                                JOIN users u ON u.user_id = cu.user_id
                                WHERE r.name = '${room}'`;
        db.query(getUsersQuery, (err, res) => {
            if (err) { return reject(err); }
            resolve(res);
        });
    });
}

module.exports = {
    userJoin, 
    getCurrentUser,
    userLeave,
    getRoomUsers
};