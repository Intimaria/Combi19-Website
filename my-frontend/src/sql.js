let mysql = require("mysql");

let conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pruebaNode'
});

conexion.connect();

conexion.query('SELECT nombre FROM usuarios', function (error, results, fields) {
    if (error) throw error;
    results.forEach(element => {
        console.log(element.nombre);
    });
});

conexion.end();