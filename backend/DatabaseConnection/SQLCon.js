const Database = require("sqlite3")
const connection = new Database.Database(process.env.DB_PATH || "eventease.db", (err)=>{
    if(err)
        {
           return 
        }
    console.log("Database connection successful")
})

// Run statements strictly in the order they are issued (needed for atomic bookings).
connection.serialize()

module.exports = connection