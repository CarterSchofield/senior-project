//* fileName: db.js

const mongoose = require("mongoose");
const mongoDB_URL = 'mongodb+srv://SE4200:cCVQfncmhq9Z7cMX@cluster0.4dntofl.mongodb.net/KareShield?retryWrites=true&w=majority';

mongoose.Promise = global.Promise;

mongoose.set('strictQuery', false);
const connect = async () => {
    mongoose.connect(mongoDB_URL);
    const db = mongoose.connection;
    db.on("error", () => {
        console.log("could not connect");
    });
    db.once("open", () => {
        console.log("> Successfully connected to database");
    });
};
module.exports = { connect };