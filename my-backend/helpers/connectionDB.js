const mysql = require('mysql2/promise');

const prepareConnection = async () => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mydb'
    });
}

module.exports = {
    prepareConnection
}