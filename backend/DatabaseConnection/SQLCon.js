const Database = require("sqlite3")
const connection = new Database.Database(process.env.DB_PATH || "eventease.db", (err)=>{
    if(err)
        {
           return 
        }
    console.log("Database connection successful")
})

module.exports = connection