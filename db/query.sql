
/*SELECT employees.id,employees.first_name,employees.last_name,employees.manager_id, roles.role_title, departments.dept_name, roles.salary,
    CONCAT (ManagerName.first_name,' ', ManagerName.last_name) AS Manager
FROM employees
LEFT JOIN employees AS ManagerName ON employees.manager_id = ManagerName.id
JOIN roles ON employees.role_id = roles.id
JOIN departments on employees.dept_id = departments.id
ORDER BY employees.id;*/
 /*this goes in the server.js file*/
 /*dumbledore, the headmaster, is missing, how to get him back with this method?*/

 /*SELECT id FROM employees WHERE employees.first_name = "MINERVA"*/

 SELECT employees.id,employees.first_name,employees.last_name,employees.manager_id, roles.role_title, departments.dept_name, roles.salary,
    CONCAT (ManagerName.first_name,' ', ManagerName.last_name) AS Manager
FROM employees
LEFT JOIN employees AS ManagerName ON employees.manager_id = ManagerName.id
JOIN roles ON employees.role_id = roles.id
JOIN departments on employees.dept_id = departments.id
WHERE Manager = "Albus Dumblerdore"