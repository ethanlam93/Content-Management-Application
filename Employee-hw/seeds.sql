
-- Create all the departments whithin your organization
INSERT INTO department (name)
VALUES ("Finance"),("Marketing"),("Human Resources"),("Technology"),("Sales");

-- Create roles within your department
INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 45000,1),("Senior Accountant", 80000,1),("Partner", 110000,1)
,("Sale person", 20000,2),("Sale Lead", 45000,2), ("Sale Manager", 60000,2)
,("Human Resouce Manager", 59000,3), ("Human Resource Assistant", 25000,3)
,("Junior Developer", 45000,4), ("Senior Developer", 80000,4), ("Software Engineer", 133000,4)
,("Marketing Associate", 34000,5),("Marketing Manager", 50000,5);

-- Create managers
INSERT INTO manager (managerName)
VALUES ("Jack"),("Jung"),("James"),("Logan"),("Kevin");


-- Create dummy emloyees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ethan", "Lam", 3, 1);

