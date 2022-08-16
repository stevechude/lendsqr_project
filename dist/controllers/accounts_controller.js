"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = exports.getAlluserAccounts = exports.accountTransactions = exports.withdrawFromAccount = exports.creditAccount = exports.login = exports.createUserAccount = void 0;
const utils_1 = require("../service/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../database/db"));
const createUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newAccount = yield (0, utils_1.createAccount)(req.body);
        // console.log(newAccount)
        res.status(200).json({ msg: "Account created successfully.", newAccount });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("something went wrong");
    }
});
exports.createUserAccount = createUserAccount;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const login = yield (0, utils_1.userLogin)(req.body);
        const { error } = (0, utils_1.validate)(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        // console.log(login);
        const [user] = yield db_1.default.from("bank").select("*").where("email", "=", req.body.email);
        if (user) {
            const token = jsonwebtoken_1.default.sign({ _id: user.email, accountNumber: user.account_number }, `${process.env.JWT_SECRET}`);
            if (login) {
                res.status(200).json({
                    msg: `logged in successfully.`,
                    token,
                });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json("network error, something went wrong.");
    }
});
exports.login = login;
const creditAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const funds = yield (0, utils_1.credit)(req.body);
        res.status(200).json({ msg: `account credited`, funds });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("An error occured, unable to deposit funds.");
    }
});
exports.creditAccount = creditAccount;
const withdrawFromAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const withdrawFunds = yield (0, utils_1.withdraw)(req.body);
        res.status(200).json({ msg: `withdrawal successful.`, withdrawFunds });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("An error occured, unable to make withdrawal.");
    }
});
exports.withdrawFromAccount = withdrawFromAccount;
const accountTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { senderAcc, receiverAcc, amount } = req.body;
        const [sender] = yield db_1.default
            .from("bank")
            .select("*")
            .where("account_number", "=", req.body.senderAcc);
        if (sender && sender.balance > req.body.amount) {
            yield (0, utils_1.transfer)(req.body);
            res.status(200).json({ msg: "Transfer Successful." });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json("An error occured, transfer failed.");
    }
});
exports.accountTransactions = accountTransactions;
const getAlluserAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [allAccounts] = yield db_1.default.select('*').table('bank');
        if (allAccounts)
            res.status(200).json(allAccounts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("network error, something went wrong.");
    }
});
exports.getAlluserAccounts = getAlluserAccounts;
// Middleware Function
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.header("x-auth-token");
    console.log(token);
    if (!token)
        return res.status(401).send("Access Denied");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        if (decoded) {
            next();
        }
    }
    catch (error) {
        res.status(401).json("not authorized");
    }
});
exports.protect = protect;
