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
const initDatabase = require('./db/init');

initDatabase()
    .then(() => {
        app.listen(config.port, () => {
            console.log(`Listening on port : ${config.port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialise the database:', err);
        process.exit(1);
    });
