INSERT INTO departments (name)
VALUES ("Engineering"),
	   ("Finance"),
	   ("Legal"),
	   ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 1),
	   ("Software Engineer", 80000, 1),
	   ("Account Manager", 140000, 2),
	   ("Accountant", 70000, 2),
	   ("Legal Team Lead", 200000, 3),
	   ("Salesperson", 45000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Christy", "Le", 2, 3),
	   ("Jeannie", "Le", 2, 3),
	   ("Jimmy", "Le", 1, null),
	   ("Emily", "Luong", 3, null),
	   ("Melissa", "Stan", 4, 4),
	   ("Jack", "Li", 4, 4),
	   ("Hao", "Dang", 5, null),
	   ("Guillermo", "Duque", 6, null);



