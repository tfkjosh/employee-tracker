const inquirer = require('inquirer');
const mysql = require('mysql2');


let db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: "",
  database: 'employee_db'
});


function menu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        pageSize: 8,
        message: `
╭────────────────────────────╮
│ WHAT WOULD YOU LIKE TO DO? │ 
╰────────────────────────────╯
`,
        choices: [
          `1. View all departments`,
          `2. View all roles`,
          `3. View all employees`,
          `4. Add a department`,
          `5. Add a role`,
          `6. Add an employee`,
          `7. Update an employee role`,
          `8. Exit`
        ]
      }
    ]).then((passedObject) => { 
      switchFunction(passedObject.choice.charAt(0))
    });
}

function switchFunction(choice) {
  switch (choice) {
    case '1':
      viewDepartments();
      break;
    case '2':
      viewRoles();
      break;
    case '3':
      viewEmployees();
      break;
    case '4':
      addDepartment();
      break;
    case '5':
      addRole();
      break;
    case '6':
      addEmployee();
      break;
    case '7':
      updateEmployeeRole();
      break; 
    default:
      // end of Node
      console.log(` GoodBye!`)
      process.kill(process.pid, "SIGINT");
  }
}

//get Departments
async function getDepartments() {
  const sql = `SELECT * FROM department`;
  let departments = [];
  const thenable = {
    then: function (resolve, _reject) {
      db.query(sql, async (err, results) => {
        for await (row of results) {
          let { id, name } = row;
          departments.push(`${id} ${name}`);
        };
        resolve();
      });
    }
  };
  await thenable; 
  return departments;
}
// get employees 
async function getEmployees() {
  const sql = `SELECT id, first_name, last_name FROM employee`;
  let employees = []
  const thenable = {
    then: function (resolve, _reject) {
      db.query(sql, async (err, results) => {
        for await (row of results) {
          let { id, first_name, last_name } = row;
          employees.push(`${id} ${first_name} ${last_name}`);
        };
        resolve();
      });
    }
  };
  await thenable;
  return employees;
}

// get Role
async function getRoles() {
  const sql = 'SELECT * FROM role';
  let roles = [];
  const thenable = {
    then: function (resolve, _reject) {
      db.query(sql, async (err, results) => {
        for await (row of results) {
          let { id, title, salary, department_id } = row;
          roles.push(`${id} ${title}`);
        };
        resolve();
      });
    }
  };
  await thenable;
  return roles;
}

//view Department
function viewDepartments() {
  const sql = 'SELECT * FROM department';

  db.query(sql, (err, results) => {


    console.log(`| id | name                  |`)
    for (const { id, name } of results) {
      console.log(`| ${id}  | ${name} |`)
    }
    menu();
  });
}

//view Roles
function viewRoles() {
  const sql = 'SELECT * FROM role';
  db.query(sql, (err, results) => {
    console.log(`| id | title    | salary | department_id |`)
    for (const {id, title, salary, department_id} of results) {
      console.log(`${id}  ${title}  ${salary}  ${department_id}`)
    }
    menu();
  });
}

//view Employee
async function viewEmployees() {
  const sql = 'SELECT * FROM employee';
  db.query(sql, async (err, results) => {
    console.log(`| id | first_name | last_name | role_id | manager_id |`)
    for await (const { id, first_name, last_name, role_id, manager_id } of results) {
      console.log(`${id}  ${first_name}  ${last_name}  ${role_id}  ${manager_id}`)
    }
    menu();
  });
}


async function addDepartment() {
  const sql = `INSERT INTO department (name) 
              VALUES (?)`;
  let params;

  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: `Enter the department name: `,
      }
    ]).then((passedObject) => { 
      params = passedObject.name
    });

  db.query(sql, params, (err, results) => {
    menu();
  })
}
async function addRole() {
  const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
  let departments = await getDepartments();
  let params;
  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: `Enter the title of the role: `,
      },
      {
        type: 'number',
        name: 'salary',
        message: `Enter the salary: `,
      },
      {
        type: 'list',
        name: 'department_id',
        pageSize: departments.length,
        message: `Which department: `,
        choices: departments
      }
    ]).then(({ title, salary, department_id }) => { 
      params = [title, salary, department_id[0]]
    });
  db.query(sql, params, (err, results) => {
    menu();
  })
}

async function addEmployee() {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  let roles = await getRoles();
  let employees = await getEmployees();
  let params;
  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: `First name of employee: `,
      },
      {
        type: 'input',
        name: 'last_name',
        message: `Last name of employee: `,
      },
      {
        type: 'list',
        name: 'role_id',
        message: `Role of employee: `,
        pageSize: roles.length,
        choices: roles
      },
      {
        type: 'list',
        name: 'manager_id',
        message: `Manager ID: `,
        pageSize: employees.length,
        choices: employees
      }
    ]).then(({ first_name, last_name, role_id, manager_id }) => { 
      params = [first_name, last_name, role_id[0], manager_id[0]]
    });

  db.query(sql, params, (err, results) => {
    menu();
  })
}

async function updateEmployeeRole() {
  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  let roles = await getRoles();
  let employees = await getEmployees();
  let params;
  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: `Pick your emloyee: `,
        pageSize: employees.length,
        choices: employees
      },
      {
        type: 'list',
        name: 'role_id',
        message: `Change their role: `,
        pageSize: roles.length,
        choices: roles
      },

    ]).then(({ id, role_id }) => {
      params = [role_id[0], id[0]] 
    });

  db.query(sql, params, (err, results) => {
    menu();
  })
}

menu()
