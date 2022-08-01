// Importing packages
const express = require("express");
const mysql = require("mysql12");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "root123",
        database: "business_db",
    },
    console.log(`Connected to the business_db database.`)
);
