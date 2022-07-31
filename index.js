// Packages needed for this application
const inquirer = require("inquirer");
const consoleTable = require("console.table");

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
            console.log(answer);
			console.log(answer.userAnswer);

			// Depending on what the answer is, execute the following code for the case
            switch (answer.userAnswer) {
                case "View All Employees":
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
