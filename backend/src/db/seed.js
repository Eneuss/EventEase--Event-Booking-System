const { run } = require('./connection');
const { hashPassword } = require('../utils/password');

// Demo data for local development. Event dates are relative to the seeding day,
// so the demo always has upcoming events, plus one past event to show that it cannot be booked.
function isoDateFromToday(days) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}

const events = [
    { name: 'Rock Concert', category: 'Concert', location: 'London', days: 30, lon: -0.1278, lat: 51.5074,
      description: 'A thrilling live rock concert in London.',
      tickets: [['General', 50, 100], ['VIP', 120, 50], ['Student', 35, 25]] },
    { name: 'Tech Conference', category: 'Conference', location: 'Manchester', days: 45, lon: -2.2426, lat: 53.4808,
      description: 'A gathering of tech minds discussing AI and web development.',
      tickets: [['General', 75, 200], ['VIP', 150, 80]] },
    { name: 'Football Match', category: 'Sports', location: 'Liverpool', days: 60, lon: -2.9778, lat: 53.4084,
      description: 'A home fixture at Anfield.',
      tickets: [['General', 40, 150], ['VIP', 90, 80]] },
    { name: 'Cooking Workshop', category: 'Workshop', location: 'Birmingham', days: 75, lon: -1.8936, lat: 52.4862,
      description: 'Learn the basics of Italian cooking.',
      tickets: [['General', 30, 50]] },
    { name: 'Jazz Night', category: 'Concert', location: 'London', days: -10, lon: -0.1337, lat: 51.5136,
      description: 'An evening of live jazz in Soho (already took place).',
      tickets: [['General', 25, 60]] },
];

const users = [
    { username: 'demo', password: 'demo1234', isAdmin: 0 },
    { username: 'admin', password: 'admin1234', isAdmin: 1 },
];

async function seed() {
    for (const event of events) {
        const { lastID: eventID } = await run(
            'INSERT INTO events (name, category, location, date, lon, lat, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [event.name, event.category, event.location, isoDateFromToday(event.days), event.lon, event.lat, event.description]);
        for (const [ticketType, price, availability] of event.tickets) {
            await run(
                'INSERT INTO tickets (eventID, ticketType, price, availability) VALUES (?, ?, ?, ?)',
                [eventID, ticketType, price, availability]);
        }
    }
    for (const user of users) {
        await run('INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)',
            [user.username, await hashPassword(user.password), user.isAdmin]);
    }
}

module.exports = { seed, isoDateFromToday };
