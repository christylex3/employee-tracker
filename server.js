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

const roleQuestions = [
	{
		type: "input",
		message: "What will be the title of this role?",
		name: "roleTitle",
	},
	{
		type: "input",
		message: "What will be the salary for this role?",
		name: "roleSalary",
	},
	{
		type: "input",
		message: "What department will this role be under?",
		name: "roleDepartment",
	},
]

// Begins prompting user with a question about what user wants to do
function startQuestion() {
	inquirer
		.prompt(whatToDoQuestion)
		.then((answer) => {
			// Depending on what the answer is, execute the following code for the case
			switch (answer.userAnswer) {
				// TODO: To get table to show first before asking the question again
				// Need promise?
				case "View All Employees":
					getAllEmployees();
					break;
				case "Add Employee":
					break;
				case "Update Employee":
					break;
				case "View All Roles":
					getAllRoles();
					break;
				case "Add Role":
					// Prompt user to answer questions for adding role
					// Then store their answer as the params for the sql call
					// Finally, use that sequel call
					inquirer
						.prompt(roleQuestions)
						.then((roleAnswer) => {
							// let title = roleAnswer.roleTitle;
							// let salary = roleAnswer.roleSalary;
							// let department = roleAnswer.roleDepartment;
							const addRoleSql = `INSERT INTO role (title, salary, department_id)
							VALUES (?, ?, ?)`;
							let params = [roleAnswer.roleTitle, roleAnswer.roleSalary, roleAnswer.roleDepartment];
							db.query(addRoleSql, params, (err, result) => {
								if (err) {
									console.log(err);
									return;
								}
								// let addRoleTable = consoleTable.getTable(result);
								console.log(result);
								})
						});
					break;
				case "View All Departments":
					getAllDepartments();
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

function getAllEmployees() {
	// id, first name, last name, title, department, salary, manager
	const allEmployeeSql = `SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name AS department, role.salary, CONCAT(e2.first_name,' ', e2.last_name) AS manager
	FROM (((employee e1
	LEFT JOIN role ON e1.role_id = role.id)
	LEFT JOIN department ON role.department_id = department.id)
	LEFT JOIN employee e2 ON e1.manager_id = e2.id)`;
	db.query(allEmployeeSql, (err, rows) => {
		if (err) {
			console.log(err);
			return;
		}
		let allEmployeeTable = consoleTable.getTable(rows);
		console.log(`\n\n${allEmployeeTable}`);
	});
}

function getAllRoles() {
	// id, title, department, salary
	const allRoleSql = `SELECT role.id, role.title, department.name AS department, role.salary 
	FROM role
	LEFT JOIN department on role.department_id = department.id`;
	db.query(allRoleSql, (err, rows) => {
		if (err) {
			console.log(err);
			return;
		}
		let allRoleTable = consoleTable.getTable(rows);
		console.log(`\n\n${allRoleTable}`);
	});
}

function getAllDepartments() {
	// id, department
	const allDepartmentSql = `SELECT * FROM department`;
	db.query(allDepartmentSql, (err, rows) => {
		if (err) {
			console.log(err);
			return;
		}
		let allDepartmentTable = consoleTable.getTable(rows);
		console.log(`\n\n${allDepartmentTable}`);
	});
}

// Calls this function to begin prompting user with the question
startQuestion();
