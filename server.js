const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

// Constants
const secretKey = 'RoboucupDuemilaVentiCinque'; // Change to a more secure secret in production
// Atlas
const uri = "mongodb+srv://gabrielecont2006:UyUbiRmhulEDuLOq@robocupdb.4lwxc.mongodb.net/?retryWrites=true&w=majority&appName=robocupDB";
const dbName = 'robocup_db';
let db;
app.use(cors({
    // origin: 'http://127.0.0.1:5500', // front-end port
    origin: "https://purple-v.onrender.com",
    credentials: true
}));
// Atlas
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
app.use(express.static(path.join(__dirname, '/')));
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db(dbName).command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        db = client.db(dbName);


        app.use(express.json()); // Middleware to parse JSON request body
        // Fallback route to serve index.html
        app.get('/', (req, res) => {
          res.sendFile(__dirname + '/index.html');
        });
        app.post('/register', async (req, res) => {
            if (!db) {
                return res.status(500).json({ message: 'Database not connected' });
            }
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            try {
                // Check if user already exists
                const existingUser = await db.collection('users').findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: 'User already exists' });
                }

                // Hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                // Create new user
                const newUser = { name, email, password: hashedPassword };
                const result = await db.collection('users').insertOne(newUser);

                res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
            } catch (err) {
                console.error('Error during registration:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // -------------------
        // User Login
        // -------------------
        app.post('/login', async (req, res) => {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            try {
                // Check if user exists
                const user = await db.collection('users').findOne({ email });
                if (!user) {
                    return res.status(400).json({ message: 'Invalid email or password' });
                }

                // Compare the provided password with the hashed password in the database
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid email or password' });
                }

                // Generate a JWT token
                const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });

                res.json({ message: 'Login successful', token });
            } catch (err) {
                console.error('Error during login:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // ---------------
        // Protected Route
        // ---------------

        app.get('/admin', verifyToken, (req, res) => {
            // If this route is reached, the token was valid
            res.json({ message: 'Welcome to your admin page!', user: req.user });
        });


        // Middleware to verify JWT token
        function verifyToken(req, res, next) {
            // Extract token from the Authorization header
            const token = req.headers['authorization'];

            if (!token) {
                return res.status(401).json({ message: 'Access denied. No token provided.' });
            }

            try {
                // Verify the token using the secret key
                const decoded = jwt.verify(token, secretKey);
                req.user = decoded; // Attach the decoded user information to the request object
                next(); // Pass the request to the next middleware/route
            } catch (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
        }

        app.get('/api/data', async (req, res) => {
            try {
                const db = client.db(dbName); // Replace with your database name
                const collection = db.collection('teams'); // Replace with your collection name

                // Query MongoDB for the data
                const data = await collection.find({}).toArray(); // Find all documents

                // Send the data as a JSON response
                res.json(data);
            } catch (error) {
                console.error('Error fetching data from MongoDB:', error);
                res.status(500).json({ error: 'An error occurred' });
            }
        });

        // saving the modified datas into the mongo collection 'teams'
        app.post('/save-json', async (req, res) => {
            if (!db) {
                return res.status(500).json({ message: 'Database not connected' });
            }
            const updatedData = req.body;
            // Convert the JavaScript object back to a JSON string
            const jsonData = JSON.stringify(updatedData, null, 2);

            try {
                // Step 1: Delete all documents in the collection
                await db.teams.deleteMany({});

                // Step 2: Insert new documents
                await db.teams.insertOne(jsonData);
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to save JSON data' });
            }
        });

        // Start the server
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error(err);
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
