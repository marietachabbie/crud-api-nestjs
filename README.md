# CRUD API on NestJS

`NestJS` app with `MongoDB` database with only one schema `Users`.

## Supported endpoints:
* POST {baseUrl}/auth/login (logs on, returns access token (`JWT`))
###
* GET {baseUrl}/api/users/ (gets all users)
* GET {baseUrl}/api/users/:id (gets user by ID)
* POST {baseUrl}/api/users (inserts new user into DB)
* POST {baseUrl}/api/users/:id (updates user by ID)
* DELETE {baseUrl}/api/users/:id (deletes user by ID)

## To install the dependencies:
```sh
npm install
```

## To run the app:
```sh
npm run start
```

## To run in dev mode (with nodemon):
```sh
npm run start:dev
```

## To run tests:
```sh
npm run test
```

___
Note: A sample of the .env file is provided to fill with optional values. A sample of `.http` file with supported endpoints is also provided to test manually via `VSCode REST Client` extension.
