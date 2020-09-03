const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const emoji = require('node-emoji')

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
                    removeEmployee(init)
                    break;
                case "Update employee role":
                    updateEmployeeRole(init)
                    break;
                case "Update manager":
                    updateEmployeeManager(init)
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
    JOIN department ON department.id = roles.department_id
    ORDER BY employee.id`, function (err, result) {
        if (err) throw err;
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
        //Create an array that holds a list of all manager
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
        const roleData = result;
        const roleList = result.map((item) => item.title);// array holds all the roles
        connection.query(`SELECT manager.id, managerName FROM manager`, function (err, result) {
            if (err) throw err;
            const managerList = result.map((item) => item.managerName);//array holds all the manager
            const managerData = result;// contain all manager name and manager id
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
                const selectedRole = roleData.filter((item) => item.title === answer.role) // filter the get the selected role
                const selectedManager = managerData.filter((item) => item.managerName === answer.manager)// filter the get the selected manager
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`, [answer.firstname, answer.lastname, selectedRole[0].id, selectedManager[0].id], function (err, result) {
                    if (err) throw err;
                    console.log(`${emoji.get("white_check_mark")}${emoji.get("white_check_mark")}${emoji.get("white_check_mark")}SUCCESSFULLY ADDED NEW EMPLOYEE: ${answer.firstname} ${answer.lastname}${emoji.get("white_check_mark")}${emoji.get("white_check_mark")}${emoji.get("white_check_mark")}`)
                    init()
                })
            })
        })
    })
}

//Remove Employee
const removeEmployee = () => {
    //Query All Employee name and id from database
    connection.query(`SELECT 
    id,
    CONCAT_WS(" ",first_name,last_name) AS name
    FROM employee`, function (err, result) {
        if (err) throw err;
        let employee = result.map((item) => item.name) // array holds all employee name
        inquirer.prompt([
            {
                type: "list",
                name: "removedEmployee",
                message: "Who would you like to remove?",
                choices: employee
            }]).then((answer) => {
                employeeId = result.filter((item) => item.name === answer.removedEmployee) // filter to get selected employee to remove
                connection.query(`DELETE FROM employee
                WHERE id = ?`, employeeId[0].id, function (err, result) {
                    if (err) throw err;
                    console.log(`${emoji.get("x")}${emoji.get("x")}${emoji.get("x")}Successfully deleted ${answer.removedEmployee} ${emoji.get("x")}${emoji.get("x")}${emoji.get("x")}`)
                    init()
                })
            })
    })
}

const updateEmployeeRole = (init) => {
    connection.query(`SELECT 
    employee.id,
    CONCAT_WS(" ",first_name,last_name) AS name
    FROM employee;`, function (err, result) {
        if (err) throw err;
        const employeeList = result;// array holds all employee data including name and id
        const employeeNameArray = result.map((item) => item.name)// array holds just employee name
        connection.query(`SELECT 
        roles.id AS roleID,
        roles.title
        FROM roles;`, function (err, result) {
            if (err) throw err;
            const employeeRoleList = result;;// array holds all role data including roleName and id
            const employeeRoleArray = result.map((item) => item.title)// array holds just roles name
            inquirer.prompt([
                {
                    type: "list",
                    name: "employeeToUpdate",
                    message: "Who would you like to update?",
                    choices: employeeNameArray
                },
                {
                    type: "list",
                    name: "roleToUpdate",
                    message: "What role you would like to update this employee?",
                    choices: employeeRoleArray
                }
            ]).then((answer) => {
                //filter to get the selected employee to update
                const selectedEmployeeToUpdate = employeeList.filter((item)=> item.name === answer.employeeToUpdate)
                //filter to get the selected role to update
                const selectedRoleToUpdate = employeeRoleList.filter((item)=> item.title === answer.roleToUpdate)
                connection.query(`UPDATE employee
                SET 
                role_id = ?
                WHERE
                employee.id = ?;`,[selectedRoleToUpdate[0].roleID,selectedEmployeeToUpdate[0].id],function (err, result) {
                    if (err) throw err;
                    console.log(`${emoji.get("white_check_mark")}${emoji.get("white_check_mark")}${emoji.get("white_check_mark")}Successfully updated ${selectedEmployeeToUpdate[0].name}'s role to ${selectedRoleToUpdate[0].title}${emoji.get("white_check_mark")}${emoji.get("white_check_mark")}${emoji.get("white_check_mark")}`)
                    init()
                })
            })
        })
    })
}

//Update Manager
const updateEmployeeManager = (init) => {
    connection.query(`SELECT 
    employee.id,
    CONCAT_WS(" ",first_name,last_name) AS name
    FROM employee;`, function (err, result) {
        if (err) throw err;
        const employeeList = result;// array holds all employee data including name and id
        const employeeNameArray = result.map((item) => item.name)// array holds just employee name
        connection.query(`SELECT 
        manager.id AS managerID,
        manager.managerName
        FROM manager;`, function (err, result) {
            if (err) throw err;
            const employeeManagerList = result;// array holds all manager data including managerName and id
            const employeeManagerArray = result.map((item) => item.managerName) // array holds just managers name
            inquirer.prompt([
                {
                    type: "list",
                    name: "employeeToUpdate",
                    message: "Who would you like to update?",
                    choices: employeeNameArray
                },
                {
                    type: "list",
                    name: "managerToUpdate",
                    message: "What manager you would like to change to?",
                    choices: employeeManagerArray
                }
            ]).then((answer) => {
                //filter to get the selected employee to update
                const selectedEmployeeToUpdate = employeeList.filter((item)=> item.name === answer.employeeToUpdate)
                //filter to get the selected manager to update
                const selectedManagerToUpdate = employeeManagerList.filter((item)=> item.managerName === answer.managerToUpdate)
                connection.query(`UPDATE employee
                SET 
                manager_id = ?
                WHERE
                employee.id = ?;`,[selectedManagerToUpdate[0].managerID,selectedEmployeeToUpdate[0].id],function (err, result) {
                    if (err) throw err;
                    console.log(`Successfully updated ${selectedEmployeeToUpdate[0].name}'s manager to ${selectedManagerToUpdate[0].managerName}`)
                    init()
                })
            })
        })
    })
}


//run program
init()