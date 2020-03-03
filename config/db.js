const mongoose = require("mongoose");
const keys = require("./keys");

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(keys.MONGO_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        if (connect) {
            console.log("Connected to MongoDB");
        } else {
            console.log("Connection Error");
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;