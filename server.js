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
// getEmps()
// getDepts()
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
//lets call down the data to use when selecting the info

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
//establishing this so I can call it in the inquirer questions
var roles = [];
var depts = [];
var emps = [];
var empID = [];
callDownData()
async function callDownData() {
  let roleArray = [];
  let deptArray = [];
  let empArray = []
  await db.promise().query('SELECT * FROM roles').then(results =>
    results[0].forEach(role => {
      // console.log("myrole" + JSON.stringify(role.role_title)),
      roles.push(role.role_title),
        roleArray.push(role)
    }
    ))
  await db.promise().query('SELECT * FROM departments').then(results =>
    results[0].forEach(dept => {
      // console.log("myrole" + JSON.stringify(role.role_title)),
      depts.push(dept.dept_name),
        deptArray.push(dept)
    }
    ))
  await db.promise().query('SELECT * FROM employees').then(results =>
    results[0].forEach(emp => {
      // console.log("myrole" + JSON.stringify(role.role_title)),
      empID.push(emp.id)
      emps.push(`${emp.first_name} ${emp.last_name}`),
        empArray.push(emp)
    }
    ))
  console.log(empID)
  console.log(emps)
  init()
}
async function init() {
  var mainMenu = await inquirer.prompt(mainMenuQuest)
  if (mainMenu.mainMenu == 'View All Wizards') {
    //if this method needs to be promise
    await callEmps().then(([rows, fields]) =>
      console.table(rows)
    )
    init()
  } else if (mainMenu.mainMenu == "Add New Wizard") {
    addEmp()
  } else if (mainMenu.mainMenu == "Update Wizard Role") {
    //somehting along the lines of based off name, selecting the individual by the name, and translating that to their unique ID
  } else if (mainMenu.mainMenu == "View All Roles") {
    ///due to the nature of the data, the employees is an intermediary between roles and dept, so the roles will have no dept_id
    await callRoles().then(([rows, fields]) =>
      console.table(rows)
    )
    init()
  } else if (mainMenu.mainMenu == "Add Role") {
    addRole()
  } else if (mainMenu.mainMenu == "View All Departments") {
    await callDepts().then(([rows, fields]) =>
      console.table(rows)
    )
    init()

  } else if (mainMenu.mainMenu == "Add Department") {
    addDept()
  } else if (mainMenu.mainMenu == "Quit") {
    return "Goodbye!"
  }
}
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
}
async function callRoles() {
  return db.promise().query('SELECT * FROM roles')
}
async function callDepts() {
  return db.promise().query('SELECT * FROM departments')
}
//inquirer questions and functions below
const mainMenuQuest = [
  {
    type: 'list',
    message: "What would you like to do?",
    choices: ["View All Wizards", "Add New Wizard", "Update Wizard Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
    name: 'mainMenu'
  }
];
const addDept = async () => {
  var deptInput = await inquirer.prompt(
    {
      type: 'input',
      message: 'What is the name of the department?',
      name: 'addDept'
    }
  )
  let enteredDept = await db.promise().query('INSERT INTO departments(dept_name) VALUES (?)', [deptInput.addDept])
  init()
}

const addRole = async () => {
  var roleInput = await inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the role',
      name: 'addRoleName'
    },
    {
      type: 'input',
      message: 'What is the salary of the role?',
      name: 'addRoleSalary'
    }
  ]
  )
  //take the info and place it in the db
  let enteredRole = await db.promise().query('INSERT INTO roles (role_title, salary) VALUES (?,?)', [roleInput.addRoleName, roleInput.addRoleSalary])
  init()
}

const addEmp = async () => {
  let manager_id;
  var empInput = await inquirer.prompt(
    [
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
        choices: roles,
        name: 'addEmpRole'
      },
      {
        type: 'list',
        message: "Which department does this employee belong to?",
        choices: depts,
        name: 'addEmpDept'
      },
      {
        type: 'list',
        message: "Who is the employee's manager?",
        choices: emps,
        name: 'addEmpManager'
      }
    ]
  )
  temp = empInput.addEmpManager.split(' ');
  db.promise().query('SELECT id FROM employees WHERE employees.first_name = ?', temp[0]).then(results =>
    console.log(results[0].id))
  //   results[0].forEach(id =>
  // manager_id = id))
  console.log(manager_id)
  // let enteredEmp = await db.promise().query('INSERT INTO employees (first_name, last_name, role_id,dept_id,manager_id) VALUES (?,?,?,?,?)', [empInput.addFirstName, empInput.addLastName, empInput.addEmpRole, empInput.addEmpDept, empInput.manager_id])
  init()
}
