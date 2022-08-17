// Importing packages
const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// const PORT = process.env.PORT || 3001;
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
			"Update Employee's Role",
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
];

const employeeUpdateQuestions = [
	{
		type: "list",
		message: "Which employee do you want to update?",
		name: "employee",
		choices: [],
	},
	{
		type: "input",
		message: "Which role do you want the employee to be assigned to?",
		name: "roleChange",
		choices: [],
	},
]

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

// Adding department question
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
			} else if (data.userAnswer == "Update Employee's Role") {
				updateEmployeeRole();
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
	const sql = `SELECT e1.id, e1.first_name, e1.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(e2.first_name," ", e2.last_name) AS manager
		FROM (((employees e1
		LEFT JOIN roles ON e1.role_id = roles.id)
		LEFT JOIN departments ON roles.department_id = departments.id)
		LEFT JOIN employees e2 ON e1.manager_id = e2.id)`;
	db.query(sql, (err, rows) => {
		if (err) {
			console.log(err);
			return;
		}

		// Prints out table of all employees
		let allEmployeeTable = consoleTable.getTable(rows);
		console.log(`\n\n${allEmployeeTable}`);
	});
	startQuestion();
}

// TODO: Adding the option of no manager *****************
// Adds employee to the database
function addEmployee() {
	// Grabs all roles
	const roleSql = `SELECT * FROM roles`;
	db.query(roleSql, (err, results) => {
		if (err) {
			console.log(err);
		}

		// Maps results to a new array
		let rolesArray = results.map(role => {
			return {
				name: role.title,
				value: role.id,
			};
		});

		// Creates role question
		let eRoleQuestion = {
			type: "list",
			message: "What is the employee's role?",
			name: "employeeRole",
			choices: rolesArray,
		};

		// Grabs all employees (any employee can be manager)
		const managerSql = `SELECT * FROM employees`;
		// WHERE (id IN (SELECT manager_id FROM employees));`
		db.query(managerSql, (err, results) => {
			if (err) {
				console.log(err);
			}
			
			// Maps results to new array
			let managersArray = results.map(manager => {
				return {
					name: manager.first_name + " " + manager.last_name,
					value: manager.id,
				};
			});

			managersArray.push({
				name: "None",
				value: null,
			});

			// Creates manager question
			let eManagerQuestion = {
				type: "list",
				message: "Who is the employee's manager?",
				name: "employeeManager",
				choices: managersArray,
			};

			// questionsToAsk holds all questions to create new employee
			let questionsToAsk = [...employeeQuestions, eRoleQuestion, eManagerQuestion];
			inquirer.prompt(questionsToAsk).then((employeeData) => {
				
				// Takes data from questions and makes new employee
				const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
					VALUES (?, ?, ?, ?)`;

				let params = [employeeData.employeeFirstName, employeeData.employeeLastName, employeeData.employeeRole, employeeData.employeeManager];
				db.query(sql, params, (err, results) => {
					if (err) {
						console.log(err); 
					}
				});

				// Restarts previous prompt
				startQuestion();
			})
		})
	});
}

function updateEmployeeRole() {
	const employeeSql = `SELECT * FROM employees`;
	db.query(employeeSql, (err, results) => {
		if (err) {
			console.log(err);
		}

		// Maps results to new array
		let employeesArray = results.map(employee => {
			return {
				name: employee.first_name + " " + employee.last_name,
				value: employee.id,
			};
	 	});

		let employeeSelection = {
			type: "list",
			message: "Which employee do you want to update?",
			name: "employeeSelected",
			choices: employeesArray,
		};

		// Grabs all roles
		const roleSql = `SELECT * FROM roles`;
		db.query(roleSql, (err, results) => {
			if (err) {
				console.log(err);
			}

			// Maps results to a new array
			let rolesArray = results.map(role => {
				return {
					name: role.title,
					// salary: role.salary,
					// department: role.department_id,
					value: role.id,
				};
			});

			// Creates role question
			let roleSelection = {
				type: "list",
				message: "What is the employee's role?",
				name: "roleSelected",
				choices: rolesArray,
			};

			let questionsToAsk = [employeeSelection, roleSelection]

			inquirer.prompt(questionsToAsk).then((data) => {
				const sql = `UPDATE employees SET role_id = ? WHERE id = ? `;
				let params = [data.roleSelected, data.employeeSelected];
				db.query(sql, params, (err, results) => {
					if (err) {
						console.log(err);
					}
				})
				startQuestion();
			})
		})
	})
}

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

		// Prints out table of all roles
		let allRoleTable = consoleTable.getTable(rows);
		console.log(`\n\n${allRoleTable}`);
	});

	// Restarts previous prompt
	startQuestion();
}

// Adds new role to database
function addRole() {
	// Grabs all deportment and store into the lists
	const departmentSql = `SELECT * FROM departments`;
	db.query(departmentSql, (err, results) => {
		if (err) {
			console.log(err);
		}

		// Maps results to new array
		let departmentsArray = results.map(department => {
			return {
				name: department.name,
				value: department.id,
			};
	 	});

		// Creates new question to add to inquirer
		let newQuestion = {
				type: "list",
				message: "Which department will this role be under?",
				name: "roleDepartment",
				choices: departmentsArray,
		};
		
		// New array that holds the roleQuestions AND newQuestion
		let questionsToAsk = [...roleQuestions, newQuestion];

		// Prompt with the questionsToAsk
		inquirer.prompt(questionsToAsk).then((roleData) => {
			const addRoleSql = `INSERT INTO roles (title, salary, department_id)
				VALUES (?, ?, ?)`;

			// Grabs data and put into query
			let params = [roleData.roleTitle, roleData.roleSalary, roleData.roleDepartment];
			db.query(addRoleSql, params, (err, results) => {
				if (err) {
					console.log(err);
				}
			});

			// Restarts previous prompt
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

		// Prints out table of all departments
		let allDepartmentTable = consoleTable.getTable(rows);
		console.log(`\n\n${allDepartmentTable}`);
	});

	// Restarts previous prompt
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

		// Restarts previous prompt
		startQuestion();
	})
}

// Calls this function to begin prompting user with the question
startQuestion();