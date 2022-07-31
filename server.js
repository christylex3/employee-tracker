const express = require("express");

const inquirer = require("inquirer");
const consoleTable = require("console.table");

const whatToDoQuestion = [
  {
    type: "list",
    message: "What would you like to do?",
    choice: [
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

function startQuestions() {
  inquirer
    .prompt(whatToDoQuestion)
    .then((data) => {
      // ...
    })
    .catch((error) => {
      if (error) {
        console.log(error);
      }
    });
}

startQuestions();