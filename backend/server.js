const loadConfig = require('./config');

let config;
try {
    config = loadConfig();
} catch (err) {
    console.error(`Configuration error: ${err.message}`);
    process.exit(1);
}
if (config.usingDevSecret) {
    console.warn('SESSION_SECRET is not set: using an insecure development secret.');
}

const app = require('./app');
const connection = require('./DatabaseConnection/SQLCon');
const initDatabase = require('./DatabaseConnection/init');

initDatabase(connection)
    .then(() => {
        app.listen(config.port, () => {
            console.log(`Listening on port : ${config.port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialise the database:', err);
        process.exit(1);
    });
