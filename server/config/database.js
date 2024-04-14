const mongoose = require('mongoose');

require('dotenv').config();

const dbconnect = ()=>{
    mongoose.connect(process.env.MONGODB_URI)
       .then(() => console.log("MongoDB Connected Successfully..."))
       .catch((err) =>{
        console.log("MongoDB Connect Failed");
        console.error(err);
        process.exit(1);
        }) 
};

// module.exports = dbconnect;     //--// database.dbconnect(); => will not work without { dbconnect }
module.exports = {dbconnect};

