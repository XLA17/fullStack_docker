const mysql = require('mysql2');

// Abstract classes for database
class Database {
    static instance = null;
    isActive = false;

    constructor(user, password, database) {
        if (new.target === Database) {
            throw new Error("Cannot instantiate an abstract class directly.");
        }

        if (Database.instance) {
            return Database.instance;
        }

        this.connect(user, password, database);

        Database.instance = this;
    }

    connect(user, password, database) {
        this.connection = mysql.createConnection({
            host: 'db', // Parce que j'utilise docker ('db' est défini dans mon docker-compose.yml)
            user: user,
            password: password,
            database: database
        });

        this.connection.connect((err) => {
            if (err) {
                console.error('Failed to connect to database:', err.code);

                if (err.code === 'ECONNREFUSED') {
                    console.log('Retrying in 5 seconds...');
                    setTimeout(() => {
                        this.connect(user, password, database);
                    }, 2000);
                } else {
                    throw err;
                }
            } else {
                console.log('Connected to the database!');
            }
        });
    }

    setConnection() {
        this.connection.connect((err) => {
            if (err) {
                console.error('Error while opening the connection:', err.stack);
                return;
            }
            console.log('Connected with id:', this.connection.threadId);
        });
    }

    closeConnection() {
        this.connection.end((err) => {
            if (err) {
                console.error('Error while closing the connection:', err.stack);
            } else {
                console.log('Connection closed');
            }
        });
    }
}

module.exports = Database;