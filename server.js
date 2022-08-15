// Importing packages
const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

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

// An array of a question that asks user what they would like to do
const whatToDoQuestion = [
	{
		type: "list",
		message: "What would you like to do?",
		name: "userAnswer",
		choices: [
			"View All Employees",
			"Add Employee",
			"Update Employee",
			"View All Roles",
			"Add Role",
			"View All Departments",
			"Add Department",
			"Quit",
		],
	},
];

// Begins prompting user with a question about what user wants to do
function startQuestion() {
	inquirer
		.prompt(whatToDoQuestion)
		.then((answer) => {
			// console.log(answer);
			// console.log(answer.userAnswer);

			// Depending on what the answer is, execute the following code for the case
			switch (answer.userAnswer) {
				case "View All Employees":
					const sql = `SELECT * FROM employee`;
					console.log(sql);
					db.query(sql, (err, rows) => {
						if (err) {
							console.log(err);
							return;
						}
						// console.log(rows);
						let allEmployeeTable = consoleTable.getTable(rows);
						console.log(allEmployeeTable);
						// res.json({
						// 	message: "Successfully retrieved all employees",
						// 	data: res,
						// });
					});
					// Once user choose this, console.table the data table that has the
					// simple query
					break;
				case "Add Employee":
					break;
				case "Update Employee":
					break;
				case "View All Roles":
					break;
				case "Add Role":
					break;
				case "View All Departments":
					break;
				case "Add Department":
					break;
				case "Quit":
					console.log("Goodbye");
			}

			// If the user does not choose 'Quit", continue prompting them with the question
			if (answer.userAnswer !== "Quit") {
				startQuestion();
			}
		})

		// If there is an error, catch the error and print it
		.catch((error) => {
			if (error) {
				console.log(error);
			}
		});
}

// Calls this function to begin prompting user with the question
startQuestion();

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});