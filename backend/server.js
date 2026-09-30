const app = require('./app');
const connection = require('./DatabaseConnection/SQLCon');
const initDatabase = require('./DatabaseConnection/init');

const PORT = 3000;

initDatabase(connection)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on port : ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialise the database:', err);
        process.exit(1);
    });
