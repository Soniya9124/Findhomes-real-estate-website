const mongoose = require("mongoose");

// Connect to the first MongoDB database (wt_project)
const wtProjectDB = mongoose.createConnection("mongodb://localhost:27017/wt_project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
wtProjectDB.on("open", () => {
    console.log("MongoDB connected to wt_project");
});
wtProjectDB.on("error", (error) => {
    console.error("Failed to connect to MongoDB (wt_project):", error);
});

// Connect to the second MongoDB database (sell_db)
const sellDB = mongoose.createConnection("mongodb://localhost:27017/sell_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
sellDB.on("open", () => {
    console.log("MongoDB connected to sell_db");
});
sellDB.on("error", (error) => {
    console.error("Failed to connect to MongoDB (sell_db):", error);
});

// Connect to the third MongoDB database (rent_db)
const rentDB = mongoose.createConnection("mongodb://localhost:27017/rent_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
rentDB.on("open", () => {
    console.log("MongoDB connected to rent_db");
});
rentDB.on("error", (error) => {
    console.error("Failed to connect to MongoDB (rent_db):", error);
});

// schema for login details
const loginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// schema for house details
const sellSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    rooms: {
        type: Number,
        required: true,
    },
    description: String, 
    images: [String],

    price: {
        type: Number,
        required: true,
    },
});


const rentSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    rooms: {
        type: Number,
        required: true,
    },
    description: String,
    images: [String],

    rent: {
        type: Number,
        required: true,
    },
});

// Model for login collection
const loginCollection = wtProjectDB.model("logincollections", loginSchema);

// Model for house collection
const sellCollection = sellDB.model("sellcollections", sellSchema);

// Model for rent collection
const rentCollection = rentDB.model("rentcollections", rentSchema);

module.exports = {
    loginCollection,
    sellCollection,
    rentCollection,
};
