const Database = require('./Database');

class MorpyamDatabase extends Database {
    constructor() {
        super('morpyam_appli', 'jR]0dNx8[F7pL2', 'Morpyamdb'); // TODO: à sécuriser !
    }

    // Just an example
    getDate() {
        this.setConnection();

        this.connection.query('SELECT NOW()', (err, results) => {
            if (err) throw err;
            console.log('Résultat de la requête :', results);
        });

        this.closeConnection();
    }
}

module.exports = MorpyamDatabase;