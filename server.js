const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

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
      emps.push(`${emp.first_name} ${emp.last_name}`),
        empArray.push(emp)
    }
    ))
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
    updateEmp()
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
  } else if (mainMenu.mainMenu == "View Employees by Manager") {
    filterbyManager().then(([rows, fields]) =>
      console.table(rows)
    )
  
  } else if (mainMenu.mainMenu == "View Employees by Role") {
    filterbyRole()
  
    // init()
  }else if (mainMenu.mainMenu == "View Employees by Department") {
    filterbyDept().then(([rows, fields]) =>
      console.table(rows)
    )
    init()
  }else if (mainMenu.mainMenu == "Quit") {
    return "goodbye"
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
    choices: ["View All Wizards", "Add New Wizard", "Update Wizard Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "View Employees by Manager", "View Employees by Role", "View Employees by Department", "Quit"],
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
  let role_id;
  let dept_id;
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
  managerName = empInput.addEmpManager.split(' ');
  await db.promise().query('SELECT id FROM employees WHERE employees.first_name = ?', managerName[0]).then(results =>
    // console.log(results[0])
    manager_id = results[0].map(function (obj) {
      return obj.id
    })

    // console.log(manager_id)
    // console.log(results[0].id)
  )
  //We want to grab the numerical value for these The query will not take the actual roles/names/depts, it was their ID numbers
  await db.promise().query('SELECT id FROM roles WHERE roles.role_title = ?', empInput.addEmpRole).then(results =>
    // console.log(results[0])
    role_id = results[0].map(function (obj) {
      return obj.id
    })
  )
  await db.promise().query('SELECT id FROM departments WHERE departments.dept_name = ?', empInput.addEmpDept).then(results =>
    // console.log(results[0])
    dept_id = results[0].map(function (obj) {
      return obj.id
    })
  )
  console.log(manager_id)
  console.log(role_id)
  console.log(dept_id)
  //lets add in the person
  let enteredEmp = await db.promise().query('INSERT INTO employees (first_name, last_name, role_id,dept_id,manager_id) VALUES (?,?,?,?,?)', [empInput.addFirstName, empInput.addLastName, role_id, dept_id, manager_id])
  init()
}

const updateEmp = async () => {
  let empID;
  let roleID;
  var refreshEmp = await inquirer.prompt(
    [
      {
        type: 'list',
        message: "Which employee's role do you want to update?",
        choices: emps,
        name: 'updateEmpWho'
      },
      {
        type: 'list',
        message: "Which role do you want to assign the selected employee?",
        choices: roles,
        name: 'updateEmpRole'
      }
    ]
  )
  var firstname = refreshEmp.updateEmpWho.split(' ')
  await db.promise().query('SELECT id FROM roles WHERE role_title = ?', refreshEmp.updateEmpRole).then(results =>
    // console.log(results[0])
    roleID = results[0].map(function (obj) {
      return obj.id
    }))
  console.log(roleID)
  await db.promise().query('UPDATE employees SET role_id = ? WHERE employees.first_name = ?', [roleID, firstname[0]])

  init()
}
async function filterbyManager() {
  let managers = [];
  let managersID = [];
  let data = [];
  await db.promise().query("SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id FROM employees").then(results =>
    results[0].forEach(manager => {
      managersID.push(manager.manager_id)
      data.push(manager)
    }))

  // console.log(managersID.length)
  // console.log(data.length)
  for (let i = 0; i < data.length; i++) {
    // console.log(managersID[i])
    // console.log(data[i].id)
    if (managersID.includes(data[i].id)) {
      managers.push(`${data[i].first_name} ${data[i].last_name}`)
      // console.log("found a manager")
    }
    // else { console.log("no manager here") }
  }
  // console.log(managers)
  //ask them who they want to see
  var whichManager = await inquirer.prompt(
    {
      type: 'list',
      message: "Which Manager do you want to filter by?",
      choices: managers,
      name: "whichMan"
    }
  )
  //here we are reversing the search, by looking for the id where the first name = the desired manager's first name 
  let firstname = whichManager.whichMan.split(' ')
  await db.promise().query('SELECT id FROM employees WHERE first_name = ?', firstname[0]).then(results =>
    // console.log(results[0])
    manID = results[0].map(function (obj) {
      return obj.id
    }))
  // console.log(manID)
  //this is what we want to return, the final query in which we show them the data!
  return await db.promise().query("SELECT employees.id,employees.first_name,employees.last_name, roles.role_title, departments.dept_name, roles.salary, CONCAT (ManagerName.first_name,' ', ManagerName.last_name) AS Manager FROM employees LEFT JOIN employees AS ManagerName ON employees.manager_id = ManagerName.id JOIN roles ON employees.role_id = roles.id JOIN departments on employees.dept_id = departments.id WHERE employees.manager_id = ?", [manID])
}

async function filterbyRole() {
  let roles = [];
  let roleID = [];
  let data = [];
  await db.promise().query("SELECT * FROM roles").then(results =>
    results[0].forEach(role => {
      roles.push(role.role_title)
      data.push(role)
    }))

  // console.log(data)
  //ask them who they want to see
  var whichRole = await inquirer.prompt(
    {
      type: 'list',
      message: "Which role do you want to filter by?",
      choices: roles,
      name: "whichRole"
    }
  )
  //here we are reversing the search, by looking for the id where the first name = the desired manager's first name 
  await db.promise().query('SELECT id FROM roles WHERE role_title = ?', whichRole.whichRole).then(results =>
    // console.log(results[0])
    roleID = results[0].map(function (obj) {
      return obj.id
    }))
  //this is what we want to return, the final query in which we show them the data!
  await db.promise().query("SELECT employees.id,employees.first_name,employees.last_name, roles.role_title, departments.dept_name, roles.salary, CONCAT (ManagerName.first_name,' ', ManagerName.last_name) AS Manager FROM employees LEFT JOIN employees AS ManagerName ON employees.manager_id = ManagerName.id JOIN roles ON employees.role_id = roles.id JOIN departments on employees.dept_id = departments.id WHERE employees.role_id = ?", [roleID]).then(([rows, fields]) =>
  console.table('\n',rows)
)
init()
}

async function filterbyDept(){
  let depts = [];
  let deptID = [];
  let data = [];
  await db.promise().query("SELECT * FROM departments").then(results =>
    results[0].forEach(dept => {
      depts.push(dept.dept_name)
      data.push(dept)
    }))

  // console.log(data)
  //ask them who they want to see
  var whichDept= await inquirer.prompt(
    {
      type: 'list',
      message: "Which department do you want to filter by?",
      choices: depts,
      name: "whichDept"
    }
  )
  //here we are reversing the search, by looking for the id where the first name = the desired manager's first name 
  await db.promise().query('SELECT id FROM departments WHERE dept_name = ?', whichDept.whichDept).then(results =>
    // console.log(results[0])
    deptID = results[0].map(function (obj) {
      return obj.id
    }))
  //this is what we want to return, the final query in which we show them the data!
  return await db.promise().query("SELECT employees.id,employees.first_name,employees.last_name, roles.role_title, departments.dept_name, roles.salary, CONCAT (ManagerName.first_name,' ', ManagerName.last_name) AS Manager FROM employees LEFT JOIN employees AS ManagerName ON employees.manager_id = ManagerName.id JOIN roles ON employees.role_id = roles.id JOIN departments on employees.dept_id = departments.id WHERE employees.dept_id = ?", [deptID])

  // init()
}