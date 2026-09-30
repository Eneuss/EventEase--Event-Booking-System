-- EventEase database schema. Applied on every start; CREATE TABLE IF NOT EXISTS makes it idempotent.
-- Dates are ISO-8601 strings (YYYY-MM-DD) so they compare and sort correctly as text.

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    lon FLOAT NOT NULL,
    lat FLOAT NOT NULL,
    description TEXT
);
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventID INTEGER NOT NULL,
    ticketType TEXT NOT NULL,
    price REAL NOT NULL,
    availability INTEGER NOT NULL,
    FOREIGN KEY (eventID) REFERENCES events(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventID INTEGER NOT NULL,
    ticketType TEXT NOT NULL,
    username TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (eventID) REFERENCES events(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    isAdmin INTEGER NOT NULL DEFAULT 0
);
