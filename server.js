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

const employeeQuestions = [
	{
		type: "input",
		message: "What is the employee's first name?",
		name: "employeeFirstName",
	},
	{
		type: "input",
		message: "What is the employee's last name?",
		name: "employeeLastName",
	},
	{
		type: "input",
		message: "What is the ?",
		name: "employee",
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
];

const departmentQuestion = [
	{
		type: "input",
		message: "What is the name of the department?",
		name: "departmentName",
	},
];

// Begins prompting user with a question about what user wants to do
function startQuestion() {
	inquirer
		.prompt(whatToDoQuestion)
		.then((data) => {
			// Depending on what the answer is, execute the following code for the case
			if (data.userAnswer == "View All Employees") {
				getAllEmployees();
			} else if (data.userAnswer == "Add Employee") {
				// addEmployee();
			} else if (data.userAnswer == "Update Employee") {
				// updateEmployee();
			} else if (data.userAnswer == "View All Roles") {
				getAllRoles();
			} else if (data.userAnswer == "Add Role") {
				// addRole();
			} else if (data.userAnswer == "View All Departments") {
				getAllDepartments();
			} else if (data.userAnswer == "Add Department") {
				addDepartment();
			} else {
				console.log("Goodbye.");
				process.exit();
			}
		})
		// If there is an error, catch the error and print it
		.catch((error) => {
			if (error) {
				console.log(error);
			}
		});
}

// Gets all employees (shows id, first name, last name, title, department, salary, manager's full name or null if no manager)
function getAllEmployees() {
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
	startQuestion();
}

// function addEmployee() {
// 	inquirer
// 		.prompt(employeeQuestions)
// 		.then((employeeData) => {
// 			employee
// 		})
// 	const addEmployeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
// 	VALUES (?)`;
// 	let params =
// }

// Gets all roles (shows: id, title, department, salary)
function getAllRoles() {
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
	startQuestion();
}

// Gets all departments (shows: id, department)
function getAllDepartments() {
	const allDepartmentSql = `SELECT * FROM department`;
	db.query(allDepartmentSql, (err, rows) => {
		if (err) {
			console.log(err);
			return;
		}
		let allDepartmentTable = consoleTable.getTable(rows);
		console.log(`\n\n${allDepartmentTable}`);
	});
	startQuestion();
}

// Adds department to database
function addDepartment() {
	inquirer.prompt(departmentQuestion).then((departmentData) => {
		let name = departmentData.departmentName;
		const addDepartmentSql = `INSERT INTO department (name)
			VALUES (?)`;
		db.query(addDepartmentSql, name, (err, results) => {
			if (err) {
				console.log(err);
			}
		});
		startQuestion();
	})
	.catch((error) => {
		if (error) {
			console.log(error);
		}
	});
}

// Calls this function to begin prompting user with the question
startQuestion();


	// 	case "Add Role":
			// 		// Prompt user to answer questions for adding role
			// 		// Then store their answer as the params for the sql call
			// 		// Finally, use that sequel call
			// 		inquirer.prompt(roleQuestions).then((roleAnswer) => {
			// 			// let title = roleAnswer.roleTitle;
			// 			// let salary = roleAnswer.roleSalary;
			// 			// let department = roleAnswer.roleDepartment;
			// 			const addRoleSql = `INSERT INTO role (title, salary, department_id)
			// 				VALUES (?, ?, ?)`;
			// 			let params = [
			// 				roleAnswer.roleTitle,
			// 				roleAnswer.roleSalary,
			// 				roleAnswer.roleDepartment,
			// 			];
			// 			db.query(addRoleSql, params, (err, result) => {
			// 				if (err) {
			// 					console.log(err);
			// 					return;
			// 				}
			// 				// let addRoleTable = consoleTable.getTable(result);
			// 				console.log(result);
			// 			});
			// 		});
			// 		break;
			// 	case "View All Departments":
			// 		getAllDepartments();
			// 		break;
			// 	case "Add Department":
			// 		addDepartment();
			// 		break;
			// 	case "Quit":
			// 		console.log("Goodbye");
			// }
			// If the user does not choose 'Quit", continue prompting them with the question
			// if (answer.userAnswer !== "Quit") {
			// 	startQuestion();
			// }