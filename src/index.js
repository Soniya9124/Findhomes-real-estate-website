const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const multer = require('multer');
const mongoose = require('mongoose');
const { loginCollection } = require("./mongodb");
const { sellCollection } = require("./mongodb");
const { rentCollection } = require("./mongodb");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));

// Render the home page initially
app.get("/", (req, res) => {
    res.render("home");
});

// Route for the signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Route for handling signup form submission

app.post("/signup", async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    };
    try {
        const result = await loginCollection.insertMany([data]);
        console.log("Data inserted successfully:", result);
        res.render("dashboard"); // Redirect to the home page or another page after signup
    } catch (error) {
        console.error("Error during signup:", error); // Log the actual error
        res.send(`Error during signup: ${error.message}`); // Send a more informative response
    }
});


// Route for the login page
app.get("/login",(req,res)=>{
    res.render("login");
});

// Route for handling login form submission
app.post("/login", async (req, res) => {
try {
    const check = await loginCollection.findOne({ email: req.body.email });

    if (check && check.password === req.body.password) {
        res.render("dashboard");
        console.log('Input Email:', req.body.email);
        console.log('Input Password:', req.body.password);
    } else {
        res.render("login", { error: "Wrong password" });
    } 
  }
  catch (error) {
    console.error("Error during login:", error);
    res.send(`Error during login: ${error.message}`);
}
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});


// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
}).array('images', 5); // Allowing up to 5 images


// Route for rendering the form to add a new house
app.get('/sell', (req, res) => {
    res.render('sell');
});


app.post('/sell', async (req, res) => {
    try {
        // extract form data from the request body
        const { address, rooms, description, price } = req.body;

        //to extract filenames from req.files
        const images = req.files.map(file => file.filename);

        // create a new document in the sellCollection
        const sellHouse = await sellCollection.create({ 
            address,
            rooms,
            description,
            price,
            images,
        });

        // Log success message and send a response
        console.log('House details saved to MongoDB:', sellHouse);
        res.send('House details submitted successfully!');
    } catch (error) {
        // Log error message and send an error response
        console.error('Error saving house details to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/rent_o', (req, res) => {
    res.render('rent_o'); 
});


// Route for handling the form submission for adding a new house
app.post('/rent_o', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Error uploading files:', err);
            return res.send('Error uploading files.');
        }

        const { address, rooms, description,rent } = req.body;
        const images = req.files.map(file => file.filename);

        try {
            const rentHouse = await rentCollection.create({
                address,
                rooms,
                description,
                images,
                rent,
            });

            console.log('House details saved to MongoDB:', rentHouse);
            res.send('House details submitted successfully!');
        }

        catch (error) {
            console.error('Error saving house details to MongoDB:', error);
            res.send('Error during house details submission.');
        }
    });
});

app.get('/buy', (req, res) => {
    res.render('buy'); 
});

app.get('/rent_t', (req, res) => {
    res.render('rent_t'); 
});

app.listen(4000, () => {
    console.log("Port connected");
});
