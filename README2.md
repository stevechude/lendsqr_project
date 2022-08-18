### TABLE OF CONTENTS
- General Info
- Technologies
- Setup

### General Info
This app was built for lendsqr, 
A bank application where a new user can create an account with (first name, last name, email, password, account number, balance),
A user would have login details to login into his/her account before performing any operation, with a token generated for authentication / authorization,
A user who's logged in can fund their account,
A user can transfer funds to another user’s account,
A user can withdraw funds from their account.


### Technologies
Project is created with:
● NodeJS (LTS version)
● KnexJS ORM
● MySQL database
● Typescript
● Yarn


### Setup
run yarn install or just yarn
run yarn build for typescript to compile
run yarn start to start local server on port 8080

### Routes
http://localhost:8080/accounts (to create an account)
http://localhost:8080/login (to login as a user with a token generated in the process.)
http://localhost:8080/accounts/credit (to fund account) N/B add token to header 
http://localhost:8080/accounts/withdraw (to make withdrawals) N/B add token to header
http://localhost:8080/accounts/transfer (to transfer funds to another user's account)
http://localhost:8080/accounts/fetch (to get all the account holders in the accounts table)

## API 
https://lendsqr-bank.herokuapp.com/accounts/fetch