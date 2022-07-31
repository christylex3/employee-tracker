// const express = require("express");

const inquirer = require("inquirer");
const consoleTable = require("console.table");

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
            switch (answer) {
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
            }

            // If the user does not choose 'Quit", continue prompting them
            if (answer !== "Quit") {
                startQuestions();
            }
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
}

// Calls this function to begin prompting user with the question
startQuestion();
