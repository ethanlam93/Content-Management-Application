const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

//Create connection to MySQL database
const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "bootcamp",
    database: "cms"
});

//Attempt to connect to  MySQL database
connection.connect(function (err) {
    if (err) throw err;
    console.log("successfully connected to cms database")
});


//Ask primary question
const init = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "task",
                message: "What would you like to do?",
                choices: ["View all employee", "View employee by department", "View employee by manager", "Add employee", "Remove employee", "Update employee role", "Update manager"],
            },
        ])
        .then(answer => {
            const task = answer.task
            switch (task) {
                case "View all employee":
                    viewAllEmployee(init)
                    break;
                case "View employee by department":
                    viewByDepartment(init)
                    break;
                case "View employee by manager":
                    viewbyManager(init)
                    break;
                case "Add employee":
                    addEmployee(init)
                    break;
                case "Remove employee":
                    //run function
                    console.log("done");
                    break;
                case "Update employee role":
                    //run function
                    console.log("done");
                    break;
                case "Update manager":
                    //run function
                    console.log("done");
                    break;
            }
        })
}

//View All Employee function
const viewAllEmployee = (init) => {
    connection.query(`SELECT 
    employee.id AS "ID",
    first_name AS "First Name",
    last_name AS "Last Name",
    title AS "Title",
    managerName AS "Manager",
    salary AS "Salary",
    department.name AS "Department"
    FROM employee
    JOIN manager ON employee.manager_id = manager.id
    JOIN roles ON employee.role_id = roles.id
    JOIN department ON department.id = roles.department_id`, function (err, result) {
        if (err) throw err;
        // console.log(result) // access result
        // console.log(result[0]["First Name"]) // access First Name
        // console.log(result[0].Title) // access title
        console.table(result);
        init()
    });
}

//View All Employee by department function
const viewByDepartment = (init) => {
    connection.query(`SELECT name FROM department`, function (err, result) {
        if (err) throw err;
        //Create an array that holds a list of all department
        const departmentList = result.map((item) => item.name);
        inquirer.prompt([
            {
                type: "list",
                name: "department",
                message: "Which department's employees would you like to see?",
                choices: departmentList
            }])
            .then((result) => {
                connection.query(`SELECT 
                employee.id AS "ID",
                first_name AS "First Name",
                last_name AS "Last Name",
                title AS "Title",
                managerName AS "Manager",
                salary AS "Salary",
                department.name AS "Department"
                FROM employee
                JOIN manager ON employee.manager_id = manager.id
                JOIN roles ON employee.role_id = roles.id
                JOIN department ON department.id = roles.department_id
                WHERE department.name = ?`, [result.department], function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    init()
                });
            })
    })

}

//View All Employee by manager function
const viewbyManager = (init) => {
    connection.query(`SELECT managerName FROM manager`, function (err, result) {
        if (err) throw err;
        //Create an array that holds a list of all department
        const managerList = result.map((item) => item.managerName);
        inquirer.prompt([
            {
                type: "list",
                name: "manager",
                message: "Which manager's employees would you like to see?",
                choices: managerList
            }])
            .then((result) => {
                connection.query(`SELECT 
                employee.id AS "ID",
                first_name AS "First Name",
                last_name AS "Last Name",
                title AS "Title",
                managerName AS "Manager",
                salary AS "Salary",
                department.name AS "Department"
                FROM employee
                JOIN manager ON employee.manager_id = manager.id
                JOIN roles ON employee.role_id = roles.id
                JOIN department ON department.id = roles.department_id
                WHERE manager.managerName = ?`, [result.manager], function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    init()
                });
            })
    })

}

// Add employee
const addEmployee = (init) => {
    connection.query(`SELECT roles.id, roles.title FROM roles`, function (err, result) {
        if (err) throw err;
        // console.log(result)
        const roleData = result;
        const roleList = result.map((item) => item.title);
        connection.query(`SELECT manager.id, managerName FROM manager`, function (err, result) {
            if (err) throw err;
            //Create an array that holds a list of all department
            const managerList = result.map((item) => item.managerName);
            const managerData = result;
            // console.log(result)
            inquirer.prompt([
                {
                    type: "input",
                    name: "firstname",
                    message: "Please type employee's first name",
                    validate: function (input) {
                        if (input) { return true }
                    }
                },
                {
                    type: "input",
                    name: "lastname",
                    message: "Please type employee's last name",
                    validate: function (input) {
                        if (input) { return true }
                    }
                },
                {
                    type: "list",
                    name: "role",
                    message: "What is the employee's role",
                    choices: roleList
                },
                {
                    type: "list",
                    name: "manager",
                    message: "What is the employee's manager",
                    choices: managerList
                },
            ]).then((answer) => {
                const selectedRole = roleData.filter((item)=> item.title === answer.role)
                // console.log((selectedRole) )// log selected Role
                const selectedManager = managerData.filter((item)=> item.managerName === answer.manager)
                // console.log(selectedManager)// log selected manager
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`,[answer.firstname,answer.lastname,selectedRole[0].id,selectedManager[0].id], function (err, result) {
                    if (err) throw err;
                    console.log(`SUCCESSFULLY ADDED NEW EMPLOYEE: ${answer.firstname} ${answer.lastname}`)
                    init()
                })
            })
        })
    })}


//run program
init()