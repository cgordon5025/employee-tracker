const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config()

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: process.env.PW,
      database: 'classlist_db'
    },
    console.log(`Connected to the classlist_db database.`)
  );

  b.query('SELECT * FROM employees', function (err, results) {
    console.log(results);
  });
  
  app.use((req, res) => {
    res.status(404).end();
  });
  //display and run the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  