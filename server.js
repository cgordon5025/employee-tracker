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
    choices: () => {
      db.promise().query('SELECT * FROM roles').then(results =>
        results[0].forEach(role =>
          // console.log("myrole" + JSON.stringify(role.role_title)),
          roleArray.push(role.role_title)),
      );
      return roleArray
      },
    // getRoles(),//needs to be an updated list including the new role
    name: 'addEmpRole'
  },
  {
    type: 'list',
    message: "Which department does this employee belong to?",
    choices: "e",
    name: 'addEmpDept'
  },
  {
    type: 'list',
    message: "Who is the employee's manager?",
    choices: managerArray,//update list of possible managers? must link to the manager id
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
//have int, to grab things from db and then a second function to do the asking
async function init() {
  getRoles()
  await callEmps()
  console.log(roleArray)
  var mainMenu = await inquirer.prompt(mainMenuQuest)
  if (mainMenu.mainMenu == 'View All Wizards') {
    //if this method needs to be promise
    await callEmps().then(([rows, fields]) =>
      console.table(rows)
    )
    init()

    // console.table(empArray)
    // db.query("SELECT employees.id,employees.first_name,employees.last_name, roles.role_title, departments.dept_name, roles.salary, CONCAT (ManagerName.first_name,' ', ManagerName.last_name) AS Manager FROM employees LEFT JOIN employees AS ManagerName ON employees.manager_id = ManagerName.id JOIN roles ON employees.role_id = roles.id JOIN departments on employees.dept_id = departments.id ORDER BY employees.id;", function (err, results) {
    //   results.forEach(emp => empArray.push(emp))
    //   console.table(empArray)
    // })
  } else if (mainMenu.mainMenu == "Add New Wizard") {
    var newEmp = await inquirer.prompt(addEmp)
      .then(newEmpInput => {
        //this is the correct syntax just need to put it in the new functions I create
        db.query('INSERT INTO employees (first_name, last_name, role_id,dept_id,manager_id) VALUES (?,?,?,?,?)', newEmpInput.addFirstName, newEmpInput.addLastName, newEmpInput.addEmpRole, newEmpInput.addEmpDept, newEmpInput.addEmpManager)
      })

  } else if (mainMenu.mainMenu == "Update Wizard Role") {
    //somehting along the lines of based off name, selecting the individual by the name, and translating that to their unique ID
  } else if (mainMenu.mainMenu == "View All Roles") {
    ///due to the nature of the data, the employees is an intermediary between roles and dept, so the roles will have no dept_id
    await callRoles().then(([rows, fields]) =>
      console.table(rows)
    )
    // db.query('SELECT * FROM roles', function (err, results) {
    //   results.forEach(role => roleArray.push(role))
    //   console.table(roleArray)
    init()
  } else if (mainMenu.mainMenu == "Add Role") {
    var newRole = await inquirer.prompt(addRole)

  } else if (mainMenu.mainMenu == "View All Departments") {
    await callDepts().then(([rows, fields]) =>
      console.table(rows)
    )
    // db.query("SELECT * FROM departments", function (err, results) {
    //   results.forEach(dept => deptArray.push(dept))
    //   console.table(deptArray)
    init()

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


//all functions
async function callEmps() {
  return db.promise().query("SELECT employees.id,employees.first_name,employees.last_name, roles.role_title, departments.dept_name, roles.salary, CONCAT (ManagerName.first_name,' ', ManagerName.last_name) AS Manager FROM employees LEFT JOIN employees AS ManagerName ON employees.manager_id = ManagerName.id JOIN roles ON employees.role_id = roles.id JOIN departments on employees.dept_id = departments.id ORDER BY employees.id;")
  // console.table(results)
  // results.forEach(emp => empArray.push(emp))
  //have this run, figure out a connecting point to get this data from the callFunction to the inquirer to display
}
async function callRoles() {
  return db.promise().query('SELECT * FROM roles')
}

var roleArray = []
async function getRoles() {
  db.promise().query('SELECT * FROM roles').then(results =>
    results[0].forEach(role =>
      // console.log("myrole" + JSON.stringify(role.role_title)),
      roleArray.push(role.role_title)),
    //  console.log(results[0]))
  );
  return roleArray
  // (res => console.log(roleArray))
}
// db.promise().query('SELECT * FROM roles').then(([rows, fields]) =>
// console.table(rows.role_title))
async function callDepts() {
  return db.promise().query('SELECT * FROM departments')

}

