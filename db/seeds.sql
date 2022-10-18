/*COMMENTS FOLLOW CSS FORMAT, DONT USE THE KEYBOARD SHORTCUT, IT IS WRONG*/

INSERT INTO departments(dept_name)
VALUES('Teaching Staff'),
('Gryffindor'),
('Slytherin'),
('Raveclaw'),
('Hufflepuff');

INSERT INTO roles(role_title, salary)
VALUES ('Headmaster',1000000),
('Founder', 200000),
('Head Teacher', 100000),
('Prefect', 75000),
('Student',50000);

INSERT INTO employees(first_name, last_name, role_id,dept_id,manager_id)
VALUES ('Albus','Dumbledore',1,1,NULL),
('Godrick','Gryffindor',2,2,1),
('Minerva','McGonagall',3,2,1),
('Hermione','Granger',4,2,3),
('Harry','Potter',5,2,3),
('Salazar','Slytherin',2,3,1),
('Severus','Snape',3,3,1),
('Draco','Malfoy',4,3,7),
('Gregory','Goyle',5,3,7),
('Rowena','Ravenclaw',2,4,1),
('Filius','Flitwick',3,4,1),
('Padma', 'Patil',4,4,11),
('Luna','Lovegood',5,4,11),
('Helga','Hufflepuff',2,5,1),
('Pomona','Sprout',3,5,1),
('Cedric','Diggory',4,5,15),
('Hannah','Abbott',5,5,15);

/*
INSERT INTO managerNames(manager_name)
VALUES ('Albuse Dumbledore'),
('Minerva McGonagall'),
('Servus Snape'),
('Filius Flitwick'),
('Pomona Sprout')*/