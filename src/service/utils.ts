import db from "../database/db";
import bcrypt from "bcrypt";
import Joi from 'joi';

// FUNCTION to generate a random 10 digits account number for a new user account.
function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9999999999);
}

// FUNCTION exported to controller for creating a user's bank account
export const createAccount = async (newAccount: any) => {
  const { first_name, last_name, email, password, balance } = newAccount;

  const emailExists = await db.select('email').from('bank').where('email', '=', email);
  if(emailExists) {
    return 'User account already exists!'
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const accountCreated = await db("bank").insert({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    balance,
    account_number: generateAccountNumber(),
  });
  return ({msg: "Account created successfully.", newAccount});
};

// FUNCTION exported to controller for login a user in.
export const userLogin = async (loginDetails: any) => {

  const { email, password } = loginDetails;
  

  const [user] = await db.from("bank").select("*").where("email", "=", email);
  // console.log("user: ", user);
  const validatePassword = await bcrypt.compare(password, user.password);

  if (user && validatePassword) {
    return "Logged in successfully!";
  } else {
    return 'invalid credentials'
  }
};

// FUNCTION exported to controller for a user crediting his/her account
export const credit = async (amount: any) => {
  const { accountNumber, money } = amount;

  const user = await db
    .from("bank")
    .select("balance")
    .where("account_number", "=", accountNumber)
    .increment("balance", money);

  return amount;
};

// FUNCTION exported to controller for a user withdrawing funds.
export const withdraw = async (amount: any) => {
  const { accountNumber, money } = amount;

  const user = await db
    .from("bank")
    .select("balance")
    .where("account_number", "=", accountNumber)
    .decrement("balance", money);

  return amount;
};

// FUNCTION exported to controller for a user transfering funds.
export const transfer = async (transaction: any) => {
  const { senderAcc, receiverAcc, amount } = transaction;
  await db.transaction((tranx) => {
    db.from("bank")
      .transacting(tranx)
      .where("account_number", "=", senderAcc)
      .decrement("balance", amount)
      .then(tranx.commit)
      .catch(() => {
        tranx.rollback();
      });
  });
  await db.transaction((tranx) => {
    db.from("bank")
      .transacting(tranx)
      .where("account_number", "=", receiverAcc)
      .increment("balance", amount)
      .then(tranx.commit)
      .catch(() => {
        tranx.rollback();
      });
  });

  return transaction;
};

// FUNCTION exported to controller file for validating a user's login credentials.
export const validate = (obj: object) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(225).required(),
  });

  return schema.validate(obj);
}