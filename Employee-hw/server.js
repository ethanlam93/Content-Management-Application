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
        console.info("Task:", answer.task); //Show user the task they choose
        const task = answer.task
        switch (task) {
            case "View all employee":
                viewAllEmployee()
                console.log("done");
                break;
            case "View employee by department":
                //run function
                console.log("done");
                break;
            case "View employee by manager":
                //run function
                console.log("done");
                break;
            case "Add employee":
                //run function
                console.log("done");
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

    });

//View All Employee function
const viewAllEmployee = () => {
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
        console.table(result)
    })
}