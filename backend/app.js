const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");

const app = express();

app.use(cors());
app.use(express.json());

AWS.config.update({
    region: process.env.AWS_REGION || "us-east-1"
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.USERS_TABLE || "Users";

// Root route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// Health route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Register
app.post("/register", async (req, res) => {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "").trim();

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const params = {
        TableName: TABLE_NAME,
        Item: {
            username,
            password
        },
        ConditionExpression: "attribute_not_exists(username)"
    };

    try {
        await dynamoDB.put(params).promise();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Register error:", error);

        if (error.code === "ConditionalCheckFailedException") {
            return res.status(409).json({ message: "Username already exists" });
        }

        return res.status(500).json({ message: "Error saving user" });
    }
});

// Login
app.post("/login", async (req, res) => {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "").trim();

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const params = {
        TableName: TABLE_NAME,
        Key: {
            username
        }
    };

    try {
        const result = await dynamoDB.get(params).promise();

        if (!result.Item || result.Item.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({
            token: "dummy-token",
            message: "Login successful",
            username
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Error logging in" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});