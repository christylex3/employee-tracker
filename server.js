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

// let departmentArray = [];

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
		type: "list",
		message: "What is the employee's role?",
		name: "employeeRole",
		choices: [],
	},
	{
		type: "list",
		message: "Who is the employee's manager?",
		name: "employeeManager",
		choice: [],
	},
];



// Adding role questions
const roleQuestions = [
	{
		type: "input",
		message: "What is the name of this role?",
		name: "roleTitle",
	},
	{
		type: "input",
		message: "What is the salary for this role?",
		name: "roleSalary",
	},

];

// console.log(roleQuestions);
// console.log(roleQuestions[2]);

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
				addEmployee();
			} else if (data.userAnswer == "Update Employee") {
				// updateEmployee();
			} else if (data.userAnswer == "View All Roles") {
				getAllRoles();
			} else if (data.userAnswer == "Add Role") {
				addRole();
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
	const sql = `SELECT e1.id, e1.first_name, e1.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(e2.first_name,' ', e2.last_name) AS manager
	FROM (((employees e1
	LEFT JOIN roles ON e1.role_id = roles.id)
	LEFT JOIN departments ON roles.department_id = departments.id)
	LEFT JOIN employees e2 ON e1.manager_id = e2.id)`;
	db.query(sql, (err, rows) => {
		if (err) {
			console.log(err);
			return;
		}
		let allEmployeeTable = consoleTable.getTable(rows);
		console.log(`\n\n${allEmployeeTable}`);
	});
	startQuestion();
}

function addEmployee() {
	inquirer.prompt(employeeQuestions).then((employeeData) => {
		// How to make department id become a name?
		const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
			VALUES (?, ?, ?, ?)`;
		let params = [employeeData.employeeFirstName, employeeData.employeeLastName, employeeData.employeeRole, employeeData.employeeManager];
		db.query(sql, params, (err, results) => {
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

// function updateEmployeeRole() {
// 	inquirer.prompt().then((data) => {
// 		const sql = `UPDATE employee SET role = ? WHERE id = ? `;
// 	})
// }

// Gets all roles (shows: id, title, department, salary)
function getAllRoles() {
	const sql = `SELECT roles.id, roles.title, departments.name AS department, roles.salary 
	FROM roles
	LEFT JOIN departments on roles.department_id = departments.id`;
	db.query(sql, (err, rows) => {
		if (err) {
			console.log(err);
			return;
		}
		let allRoleTable = consoleTable.getTable(rows);
		console.log(`\n\n${allRoleTable}`);
	});
	startQuestion();
}

// FIXED...................
function addRole() {
	// Grabs all deportment and store into the lists
	const departmentSql = `SELECT * FROM departments`;
	db.query(departmentSql, (err, results) => {
		if (err) {
			console.log(err);
		}
		// let departmentsArray = results;

		console.log(results);
		// Output:
		// { id: 1, name: 'Engineering' },
		// { id: 2, name: 'Finance' },
		// { id: 3, name: 'Legal' },
		// { id: 4, name: 'Sales' }
		let departmentsArray = results.map(department => {
			return {
				name: department.name,
				value: department.id
			};
	 	});
		console.log(departmentsArray);
		// [
		// 	{ name: 'Engineering', value: 1 },
		// 	{ name: 'Finance', value: 2 },
		// 	{ name: 'Legal', value: 3 },
		// 	{ name: 'Sales', value: 4 }
		// ]
		// console.log(results.name); undefined
		// console.log(Object.keys(results));
		// // Output:
		// // [ '0', '1', '2', '3' ]
		// Object.keys(results);
		

		let newQuestion = {
				type: "list",
				message: "Which department will this role be under?",
				name: "roleDepartment",
				choices: departmentsArray,
		};
		
		// Adds a question to the roleQuestions
		let questionsToAsk = [...roleQuestions, newQuestion];

		
		inquirer.prompt(questionsToAsk).then((roleData) => {
			console.log("roleData: " + roleData);
			const addRoleSql = `INSERT INTO roles (title, salary, department_id)
				VALUES (?, ?, ?)`;


			console.log(`roleData.departmentChoice.id: ${roleData.roleDepartment}`)
			// Grabs data
			let params = [roleData.roleTitle, roleData.roleSalary, roleData.roleDepartment];

			db.query(addRoleSql, params, (err, results) => {
				if (err) {
					console.log(err);
				}
			});
			startQuestion();
		});
	})

}

// Gets all departments (shows: id, department)
function getAllDepartments() {
	const sql = `SELECT * FROM departments`;
	db.query(sql, (err, rows) => {
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
		const sql = `INSERT INTO departments (name)
			VALUES (?)`;
		db.query(sql, name, (err, results) => {
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