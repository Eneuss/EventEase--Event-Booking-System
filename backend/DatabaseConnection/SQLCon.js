const Database = require("sqlite3")
const connection = new Database.Database("eventease.db", (err)=>{
    if(err)
        {
           return 
        }
    console.log("Database connection successful")
})

module.exports = connection