const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();
const ORM = require('./ORM');

class DB {
    constructor() {
        this.orm = new ORM(this.db);
        // connect to db
        (async () => {
            // open the database
            this.db = await open({
                filename: './application/modules/db/vm21.db',
                driver: sqlite3.Database
            })
        })();
    }

    getUserByLogin(login) {
        const user = this.db.get(
            'SELECT * FROM users WHERE login=?',
            [login]
        );
        return user;
    }

    getUserByToken(token) {
        const user = this.db.get(
            'SELECT * FROM users WHERE token=?',
            [token]
        );
        return user;
    }

    getAllUsers() {
        const users = this.db.get(
            'SELECT * FROM users'
        );
        return users;
    }

    addUser(login, name, password, token) {
        const result = this.db.run(
            'INSERT INTO users (login, name, password, token) VALUES (?, ?, ?, ?)',
            [login, name, password, token]
        );
        return result;
    }

    addMessage(id, message, date, time) {
        const result = this.db.run(
            'INSERT INTO messages (user_id, message, date, time) VALUES (?,?,?,?)',
            [id, message, date, time]
        );
        return result;
    }

    updateUserToken(id, token) {
        const result = this.db.run(
            'UPDATE users SET token=? WHERE id=?',
            [token, id]
        );
        return result;
    }

    updateUserPassword(id, newPassword) {
        const result = this.db.run(
            'UPDATE users SET password=? WHERE id=?',
            [newPassword, id]
        );
        return result;
    }

    getNames() {
        const result = this.db.all(
            'SELECT name FROM users'
        );
        return result;
    }

    // --------------------------------------------------------
    // Удалить мусор после восстановления всех методов запросов

    /* destructor() {
        if (this.db) {
            this.db.end();
            this.db = null;
        }
    } */

    // Старые запросы postgres
    /* getUserByLogin(login) {
        return this.orm.detail('users', { login });
    }

    getUserByToken(token) {
        return this.orm.detail('users', { token });
    }

    getAllUsers() {
        return this.orm.list('users');
    }

    addUser(login, name, password, token) {
        return this.orm.add('users', { login, name, password, token });
    }

    addMessage(id, message) {
        const date = new Date(Date.now()).toISOString();
        return this.orm.add('messages', {user_id: id, message, date: date});
    }
    
    updateUserToken(id, token) {
        return this.orm.update('users', { token }, { id });
    }

    deleteUserToken(token) {
        return this.orm.update('users', { token: "" }, { token });
    } */
}

module.exports = DB;

/* const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

class DB {

    constructor() {
        // sqlite connect to db
        (async () => {
            // open the database
            this.db = await open({
                filename: './application/modules/db/vm21.db',
                driver: sqlite3.Database
            })
        })();
    }

    getUserByLogin(login) {
        const user = this.db.get(
            'SELECT * FROM user WHERE login=?',
            [login]
        );
        return user;
    }

    getUserByToken(token) {
        const user = this.db.get(
            'SELECT * FROM user WHERE token=?',
            [token]
        );
        return user;
    }

    getAllUsers() {
        const users = this.db.get(
            'SELECT * FROM user'
        );
        return users;
    }

    addUser(login, name, password, token) {
        const result = this.db.run(
            'INSERT INTO user (login, name, password, token, status) VALUES (?, ?, ?, ?, ?)',
            [login, name, password, token, 'online']
        );
        return result;
    }

    addMessage(id, message, date, time) {
        const result = this.db.run(
            'INSERT INTO message (user_id, message, date, time) VALUES (?,?,?,?)',
            [id, message, date, time]
        );
        return result;
    }

    updateUserToken(id, token) {
        const result = this.db.run(
            'UPDATE user SET token=? WHERE id=?',
            [token, id]
        );
        return result;
    }

    updateUserStatus(id, status) {
        const result = this.db.run(
            'UPDATE user SET status=? WHERE id=?',
            [status, id]
        );
        return result;
    }
}

module.exports = DB; */