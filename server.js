const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

require('dotenv').config()

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//setting up some arrays
var empArray = [];
var roleArray = [];
var deptArray = [];
var managerArray = ["Albus Dumbledore", "Minerva McGonagall", "Severus Snape", "Filius Flitwick", "Pomona Sprout"];

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.PW,
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

const mainMenuQuest = [
  {
    type: 'list',
    message: "What would you like to do?",
    choices: ["View All Wizards", "Add New Wizard", "Update Wizard Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
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

const addEmp = [
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
    choices: empArray,//needs to be an updated list including the new role
    name: 'addEmpRole'
  },
  {
    type: 'list',
    message: "Which department does this employee belong to?",
    choices: deptArray,
    name: 'addEmpDept'
  },
  {
    type: 'list',
    message: "Who is the employee's manager?",
    choices: empArray,//update list of possible managers? must link to the manager id
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
//need to call all the data down first since it will not be available until I view the info, due to the way I wrote this
async function callEmps() {
  var data = db.query("SELECT employees.id,employees.first_name,employees.last_name, roles.role_title, departments.dept_name, roles.salary, CONCAT (ManagerName.first_name,' ', ManagerName.last_name) AS Manager FROM employees LEFT JOIN employees AS ManagerName ON employees.manager_id = ManagerName.id JOIN roles ON employees.role_id = roles.id JOIN departments on employees.dept_id = departments.id ORDER BY employees.id;", function (err, results) {
    results.forEach(emp => empArray.push(emp))

  }
  )
  return data
}
async function init() {
  var mainMenu = await inquirer.prompt(mainMenuQuest)
  callEmps()
  if (mainMenu.mainMenu == 'View All Wizards') {
    callEmps().then(console.table(data))
    // db.query("SELECT employees.id,employees.first_name,employees.last_name, roles.role_title, departments.dept_name, roles.salary, CONCAT (ManagerName.first_name,' ', ManagerName.last_name) AS Manager FROM employees LEFT JOIN employees AS ManagerName ON employees.manager_id = ManagerName.id JOIN roles ON employees.role_id = roles.id JOIN departments on employees.dept_id = departments.id ORDER BY employees.id;", function (err, results) {
    //   results.forEach(emp => empArray.push(emp))
    //   console.table(empArray)
    await init()
  } else if (mainMenu.mainMenu == "Add New Wizard") {
    var newEmp = await inquirer.prompt(addEmp)
      .then(newEmpInput => {
        db.query('INSERT INTO employees (first_name, last_name, role_id,dept_id,manager_id) VALUES (?,?,?,?,?)', newEmp.addFirstName, newEmp.addLastName, newEmp.addEmpRole, newEmp.addEmpDept, newEmp.addEmpManager)
      })

  } else if (mainMenu.mainMenu == "Update Wizard Role") {

  } else if (mainMenu.mainMenu == "View All Roles") {
    ///due to the nature of the data, the employees is an intermediary between roles and dept, so the roles will have no dept_id
    db.query('SELECT * FROM roles', function (err, results) {
      results.forEach(role => roleArray.push(role))
      console.table(roleArray)
      init()
    })

  } else if (mainMenu.mainMenu == "Add Role") {
    var newRole = await inquirer.prompt(addRole)

  } else if (mainMenu.mainMenu == "View All Departments") {
    db.query("SELECT * FROM departments", function (err, results) {
      results.forEach(dept => deptArray.push(dept))
      console.table(deptArray)
      init()
    })

  } else if (mainMenu.mainMenu == "Add Department") {
    var newDept = await inquirer.prompt(addDepartment)

  } else if (mainMenu.mainMenu == "Quit") {

  }
}
init()
app.use((req, res) => {
  res.status(404).end();
});
//display and run the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
