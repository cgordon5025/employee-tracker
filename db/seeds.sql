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

INSERT INTO employees(first_name, last_name, role_id,dept_id)
VALUES ('Albus','Dumbledore',1,1),
('Godrick','Gryffindor',2,2),
('Minerva','McGonagall',3,2),
('Hermione','Granger',4,2),
('Harry','Potter',5,2),
('Salazar','Slytherin',2,3),
('Severus','Snape',3,3),
('Draco','Malfoy',4,3),
('Gregory','Goyle',5,3),
('Rowena','Ravenclaw',2,4),
('Filius','Flitwick',3,4),
('Padma', 'Patil',4,4),
('Luna','Lovegood',5,4),
('Helga','Hufflepuff',2,5),
('Pomona','Sprout',3,5),
('Cedric','Diggory',4,5),
('Hannah','Abbott',5,5);