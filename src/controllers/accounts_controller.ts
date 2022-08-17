import { Request, Response, NextFunction } from "express";
import {
  createAccount,
  credit,
  validate,
  transfer,
  userLogin,
  withdraw,
} from "../service/utils";
import jwt from "jsonwebtoken";
import db from "../database/db";

export const createUserAccount = async (req: Request, res: Response) => {
  try {
    const newAccount = await createAccount(req.body);
    // console.log(newAccount)
    res.status(200).json(newAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json("something went wrong");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const login = await userLogin(req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // console.log(login);
    const [user] = await db
      .from("bank")
      .select("*")
      .where("email", "=", req.body.email);
    if (user) {
      const token = jwt.sign(
        { _id: user.email, accountNumber: user.account_number },
        `${process.env.JWT_SECRET}`
      );

      if (login) {
        res.status(200).json({
          msg: `logged in successfully.`,
          token,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("network error, something went wrong.");
  }
};

export const creditAccount = async (req: Request, res: Response) => {
  try {
    const funds = await credit(req.body);
    res.status(200).json({ msg: `account credited`, funds });
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occured, unable to deposit funds.");
  }
};

export const withdrawFromAccount = async (req: Request, res: Response) => {
  try {
    const withdrawFunds = await withdraw(req.body);
    res.status(200).json({ msg: `withdrawal successful.`, withdrawFunds });
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occured, unable to make withdrawal.");
  }
};

export const accountTransactions = async (req: Request, res: Response) => {
  try {
    // const { senderAcc, receiverAcc, amount } = req.body;
    const [sender] = await db
      .from("bank")
      .select("*")
      .where("account_number", "=", req.body.senderAcc);
    if (sender && sender.balance > req.body.amount) {
      await transfer(req.body);
      res.status(200).json({ msg: "Transfer Successful." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occured, transfer failed.");
  }
};

export const getAllUserAccounts = async (req: Request, res: Response) => {
  try {
    const [allAccounts] = await db.select("*").table("bank");
    if (allAccounts) {
      res.status(200).json(allAccounts);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("network error, something went wrong.");
  }
};

// Middleware Function
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.header("x-auth-token");
  console.log(token);

  if (!token) return res.status(401).send("Access Denied");

  try {
    const decoded: any = jwt.verify(token, `${process.env.JWT_SECRET}`);
    if (decoded) {
      next();
    }
  } catch (error) {
    res.status(401).json("not authorized");
  }
};
