EventEase - Event Booking System

This is a web application that allows users to search for events by location, view them on a map and book tickets
The system is built using React for the frontend and Express with SQLite for the backend.

Project Folders:
- front-end-react: contains the React code
- back-end-Express: contains the Express server, routes, services, and DAOs

Main Features:
- User login system with session handling
- Search for events by location
- Events shown on a map using Leaflet
- Ticket booking with ticket type and quantity selection
- Only logged-in users can book events
- Prevents booking for sold-out or expired events
- Passwords are securely stored using bcrypt

How to Run:

Backend:
1. Open a terminal inside the back-end folder
2. Run: npm install
3. Run: node index.js
4. The backend runs at http://localhost:3000

Frontend:
1. Open a terminal inside the front-end-react folder
2. Run: npm install
3. Run: npm run dev
4. The frontend runs at http://localhost:5173



