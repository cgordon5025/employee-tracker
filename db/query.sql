SELECT *
FROM employees
JOIN roles ON employees.role_id = roles.id
JOIN departments on employees.dept_id = departments.id