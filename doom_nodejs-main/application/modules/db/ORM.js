class ORM {
    constructor(db) {
        this.db = db;
    }

    async detail(table, params = null, fields = '*', delimiter = 'AND') {
        if (!params) {
            return null;
        }
        let i = 1;
        let paramsStr = Object.keys(params)
            .map((key) => key += `=$${i++}`)
            .join(' ' + delimiter + ' ');

        let query = `SELECT ${fields} FROM ${table} WHERE ${paramsStr}`;
        return (await this.db.query(query, Object.values(params))).rows[0];
    }

    async list(table, params = {}, fields = '*', delimiter = 'AND') {
        if(params = {}) {
            let query = `SELECT ${fields} FROM ${table}`;
            return (await this.db.query(query, Object.values(params))).rows;
        }
        let i = 1;
        let paramsStr = Object.keys(params)
            .map((key) => key += `=$${i++}`)
            .join(' ' + delimiter + ' ');

        let query = `SELECT ${fields} FROM ${table} WHERE ${paramsStr}`;
        return (await this.db.query(query, Object.values(params))).rows;
    }

    async add(table, values = null) {
        if (!values) {
            return null;
        }
        let i = 1;
        let numbersStr = '';
        for (let key in values) {
            numbersStr += `$${i++},`
        }
        numbersStr = numbersStr.slice(0, numbersStr.length - 1);
        const params = Object.keys(values).join(',');

        let query = `INSERT INTO ${table} (${params}) VALUES (${numbersStr})`;
        await this.db.query(query, Object.values(values));
        return true;
    }

    async delete(table, params = null, delimiter = 'AND') {
        if (!params) {
            return null;
        }
        let i = 1;
        let paramsStr = Object.keys(params)
            .map((key) => key += `=$${i++}`)
            .join(' ' + delimiter + ' ');

        let query = `DELETE FROM ${table} WHERE ${paramsStr}`;
        await this.db.query(query, Object.values(params));
        return true;
    }

    async update(table, values = null, params = null, delimiter = 'AND') {
        if (!params && !values) {
            return null;
        }
        let i = 1;
        let valuesStr = Object.keys(values)
            .map((key) => key += `=$${i++}`)
            .join(',');

        let paramsStr = Object.keys(params)
            .map((key) => key += `=$${i++}`)
            .join(' ' + delimiter + ' ');

        const arr = Object.values(values).concat(Object.values(params));

        let query = `UPDATE ${table} SET ${valuesStr} WHERE ${paramsStr}`;
        await this.db.query(query, arr);
        return true;
    }

}

module.exports = ORM;