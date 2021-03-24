# How To Run
Note: Dollar Signs ($) represent terminal commands

### 1. Clone Repository
`$ git clone https://github.com/NG-Joseph/estate-access-control`
### 2. Navigate Into Repository
`cd estate-access-control`
### 2. Install dependencies
`$ npm install`
### 3. Change Database Connection Settings
In `src/app.database.module.ts` change the details such as `POSTGRES_PASSWORD` to your password. Same applies to Port and User if different

## Create Database in pgAdmin
Create a database called `estate-access-control` in pgAdmin

### 4. Run with this Command
`$ npm run start:dev`

### 5. Add /api to the end of URL to view Swagger API documentation
For example `localhost:3003/api`

### 6. Test Out API with Client e.g Postman (Optional)
You can create new users in your database from the client.
