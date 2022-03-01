<h1>HTTP Requests</h1>

1. Route /

- POST: /register - ADMIN, MANAGER
- POST: /login - ADMIN, MANAGER, STAFF, CUSTOMER

2. Route /employees

- GET: /employees - ADMIN - get all employees - MANAGER - get all employees same office

- POST: /employees - ADMIN - create a new employee

- GET: /employees/:employeeNumber - ADMIN, MANAGER - get one employee with number

- PATCH: /employees/:employeeNumber - ADMIN, MANAGER - update the employee info with number

- DELETE: /employees/:employeeNumber - ADMIN - delete the employee with number

3. Route /customers

- GET: /customers - ADMIN, MANAGER, STAFF - get all customers

- GET: /customers/:customerNumber - ADMIN, MANAGER, STAFF - get one customer with number

- POST: /customers - ADMIN, MANAGER, STAFF - create new customer

- PATCH: /customers/:customerNumber - ADMIN, MANAGER, STAFF, CUSTOMER - update the customer info with number

- DELETE: /customers/:customerNumber - ADMIN, MANAGER, STAFF - delete the customer with number

4. Route /offices - ADMIN

- GET: /offices - get all offices

- GET: /offices/:officeCode - get one office

- POST: /offices - create new office

- PATCH: /offices/:officeCode - update office info with code

- DELETE: /offices/:officeCode - delete the office with code

5. Route /productlines - ADMIN, MANAGER, STAFF

- GET: /productlines - get all product lines

- POST: /productlines - create new product line

- PATCH: /productlines/:productLine - update product line info

- DELETE: /productlines/:productLine - delete the product line

6. Route /orders

- GET: /orders - ADMIN, MANAGER, STAFF, CUSTOMER - get all orders of customer

- GET: /orders/:orderNumber - ADMIN, MANAGER, STAFF, CUSTOMER - get order details by number

- POST: /orders - ADMIN, MANAGER, STAFF, CUSTOMER - create new order for customer, can create or update customer info

- PATCH: /orders/:orderNumber - update order info with number

- DELETE: /orders/:orderNumber - delete order and order details by order number

7. Route /products

- GET: /products - ADMIN, MANAGER, STAFF, CUSTOMER - get all products

- GET: /products/:productCode - ADMIN, MANAGER, STAFF, CUSTOMER - get product info with code

- POST: /products - ADMIN, MANAGER, STAFF - create new product

- PATCH: /products/:productCode - ADMIN, MANAGER, STAFF - update product info with code

- DELETE: /products/:productCode - ADMIN, MANAGER, STAFF - delete product with code

<h1>Config setup</h1>

Must provide a dev.js file:

dev.js file must includes:  
PORT: ,
KNEX_CONFIG: {
client: 'mysql',
connection: {
host: '',
port: ,
user: '',
password: '',
database: '',
},
pool: {
min: 0,
max: 10,
},
},
JWT_SECRET: '',
BCRYPT_SALT: ,

<h1>Install Package</h1>

'npm install' or 'npm ci'

<h1>Start Server</h1>

'npm start'

<h1>Run Test Terminal</h1>

Run test: 'npm t' or 'npm run test'

Run test coverage: 'npm run nyc'

<h1>Postman Test</h1>

import file to Postman: postman_test.json

after first run test, must delete user "test" in users's table and customer "497" in customers's table

<h1>Code Structure:</h1>
    /logs

    /src

        /config

        /controllers

        /middlewares

        /models

        /routes

        /utils

    /tests

        /units

        /functions
