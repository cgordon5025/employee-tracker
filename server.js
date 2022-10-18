const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config()

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.PW,
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);
//sorting the data
db.query("SELECT employees.id,employees.first_name,employees.last_name,employees.manager_id, roles.role_title, departments.dept_name, roles.salary, CONCAT (ManagerName.first_name,' ', ManagerName.last_name) AS Manager FROM employees JOIN employees AS ManagerName ON employees.manager_id = ManagerName.id JOIN roles ON employees.role_id = roles.id JOIN departments on employees.dept_id = departments.id ORDER BY employees.id;", function (err, results) {
  console.log(results);
});

const mainMenuQuest = [
  {
    type: 'list',
    message: "What would you like to do?",
    choices: ["View All Wizards", "Update Wizard Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
    name: 'mainMenu'
  }
];
const addDepartment = [
  {
    type: 'input',
    message: 'What is the name of the department?',
    name: 'addDept'
  }
]

const addRole = [
  {
    type: 'input',
    message: 'What is the name of the role',
    name: 'addRoleName'
  },
  {
    type: 'input',
    message: 'What is the salary of the role?',
    name: 'addRoleSalary'
  },
  {
    type: 'list',
    message: "Which department does the role belong to?",
    choices: ['stuff'],//array of depts, that have been updated
    name: 'addRoleDept'
  }
]

const addWizard = [
  {
    type: 'input',
    message: "What is the employee's first name?",
    name: 'addFirstName'
  },
  {
    type: 'input',
    message: "What is the employee's last name?",
    name: 'addLastName'
  },
  {
    type: 'list',
    message: "What is the Employee's role?",
    choices: ['list of roles'],//needs to be an updated list including the new role
    name: 'addEmpRole'
  },
  {
    type: 'list',
    message: "Who is the employee's manager?",
    choices: ["people"],//update list of possible managers? must link to the manager id
    name: 'addEmpManager'
  }
]

const updateEmp = [
  {
    type: 'list',
    message: "Which employee's role do you want to update?",
    choices: ['people'],//list all the employees we have,mus thave the added people
    name: 'updateEmpWho'
  },
  {
    type: 'list',
    message: "Which role do you want to assign the selected employee?",
    choices: ['list of roles'],
    name: 'updateEmpRole'
  }
]

app.use((req, res) => {
  res.status(404).end();
});
//display and run the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
