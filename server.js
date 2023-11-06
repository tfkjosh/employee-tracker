const inquirer = require('inquirer');
const mysql = require('mysql2');


let db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: "",
  database: 'employee_db'
});

console.clear()

// condesnsed into one line 
console.log(`\n╔════════════════════════════════════════════════════════════════════════════════════╗\n║ ╔══════╗  ╔═════════╗  ╔══════╗  ╔═╗       ╔══════╗  ╔═╗   ╔═╗  ╔══════╗  ╔══════╗ ║\n║ ║ ╔════╝  ║ ╔═╗ ╔═╗ ║  ║ ╔══╗ ║  ║ ║       ║ ╔══╗ ║  ║ ║   ║ ║  ║ ╔════╝  ║ ╔════╝ ║\n║ ║ ╚═══╗   ║ ║ ║ ║ ║ ║  ║ ╚══╝ ║  ║ ║       ║ ║  ║ ║  ╚╗╚═══╝╔╝  ║ ╚═══╗   ║ ╚═══╗  ║\n║ ║ ╔═══╝   ║ ║ ╚═╝ ║ ║  ║ ╔════╝  ║ ║       ║ ║  ║ ║   ╚═╗ ╔═╝   ║ ╔═══╝   ║ ╔═══╝  ║\n║ ║ ╚════╗  ║ ║     ║ ║  ║ ║       ║ ╚════╗  ║ ╚══╝ ║     ║ ║     ║ ╚════╗  ║ ╚════╗ ║\n║ ╚══════╝  ╚═╝     ╚═╝  ╚═╝       ╚══════╝  ╚══════╝     ╚═╝     ╚══════╝  ╚══════╝ ║\n╚══╦══════════════════════════════════════════════════════════════════════════════╦══╝\n   ║ ╔═══════╗  ╔══════╗  ╔══════╗  ╔══════╗  ╔═╗  ╔═╗   ╔══════╗  ╔══════╗   ╔═╗ ║\n   ║ ╚══╗ ╔══╝  ║ ╔══╗ ║  ║ ╔══╗ ║  ║ ╔════╝  ║ ║ ╔╝╔╝   ║ ╔════╝  ║ ╔══╗ ║   ║ ║ ║\n   ║    ║ ║     ║ ╚══╝ ║  ║ ╚══╝ ║  ║ ║       ║ ╚═╝╔╝    ║ ╚══╗    ║ ╚══╝ ║   ║ ║ ║\n   ║    ║ ║     ║ ╔═╗ ╔╝  ║ ╔══╗ ║  ║ ║       ║ ╔═╗╚╗    ║ ╔══╝    ║ ╔═╗ ╔╝   ╚═╝ ║\n   ║    ║ ║     ║ ║ ╚╗╚╗  ║ ║  ║ ║  ║ ╚════╗  ║ ║ ╚╗╚╗   ║ ╚════╗  ║ ║ ╚╗╚╗   ╔═╗ ║\n   ║    ╚═╝     ╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚══════╝  ╚═╝  ╚═╝   ╚══════╝  ╚═╝  ╚═╝   ╚═╝ ║\n   ╚══════════════════════════════════════════════════════════════════════════════╝        
`
)

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
    ]).then((passedObject) => { // pass menu-item number to switch
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
      break; //unnecessary but i like it
    default:
      // ends Node
      console.log(` GoodBye!`)
      process.kill(process.pid, "SIGINT");
  }
}

// if there is time ... this function will find the longest value ... for formatting tables 
function findMax() {
  let max = 2

  return max
}

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
  await thenable; // was this all necessary?
  return departments;
}
// get employees (for inquirer lists)
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

// 1 - FINISHED
function viewDepartments() {
  const sql = 'SELECT * FROM department';

  db.query(sql, (err, results) => {
    // create a string for each row.. make super ballin
    // get all object keys .. find the largest value + 2 for side spacing
    // add them all together .. add dividers etc

    console.log(`| id | name                  |`)
    for (const { id, name } of results) {
      console.log(`| ${id}  | ${name} |`)
    }
    menu();
  });
}
// 2  - FINISHED
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
// 3 : TODO: Add Department and get name by ID or just table join?
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

// 4 - FINISHED
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
    ]).then((passedObject) => { // pull name
      params = passedObject.name
    });

  // TODO: uppercase first letter after spaces 
  // split . touppercase . join
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
    ]).then(({ title, salary, department_id }) => { // destructure
      params = [title, salary, department_id[0]]
    });
  db.query(sql, params, (err, results) => {
    menu();
  })
}
// NEED TO ADD DEPARTMENTS TO THIS -> queries should probably be based off of departments for choosing roles and managers 
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
    ]).then(({ first_name, last_name, role_id, manager_id }) => { // destructure
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

    ]).then(({ id, role_id }) => { // destructure
      params = [role_id[0], id[0]] 
    });

  db.query(sql, params, (err, results) => {
    menu();
  })
}

// Begin
menu()

// TODO: 
// ADD VALIDATION
// MAKE THE TABLE INTERFACE SMART BUILD