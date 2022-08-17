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
exports.validate = exports.transfer = exports.withdraw = exports.credit = exports.userLogin = exports.createAccount = void 0;
const db_1 = __importDefault(require("../database/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
// FUNCTION to generate a random 10 digits account number for a new user account.
function generateAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9999999999);
}
// FUNCTION exported to controller for creating a user's bank account
const createAccount = (newAccount) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password, balance } = newAccount;
    const emailExists = yield db_1.default.select('email').from('bank').where('email', '=', email);
    if (emailExists) {
        return 'User account already exists!';
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const accountCreated = yield (0, db_1.default)("bank").insert({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        balance,
        account_number: generateAccountNumber(),
    });
    return ({ msg: "Account created successfully.", newAccount });
});
exports.createAccount = createAccount;
// FUNCTION exported to controller for login a user in.
const userLogin = (loginDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginDetails;
    const [user] = yield db_1.default.from("bank").select("*").where("email", "=", email);
    // console.log("user: ", user);
    const validatePassword = yield bcrypt_1.default.compare(password, user.password);
    if (user && validatePassword) {
        return "Logged in successfully!";
    }
    else {
        return 'invalid credentials';
    }
});
exports.userLogin = userLogin;
// FUNCTION exported to controller for a user crediting his/her account
const credit = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountNumber, money } = amount;
    const user = yield db_1.default
        .from("bank")
        .select("balance")
        .where("account_number", "=", accountNumber)
        .increment("balance", money);
    return amount;
});
exports.credit = credit;
// FUNCTION exported to controller for a user withdrawing funds.
const withdraw = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountNumber, money } = amount;
    const user = yield db_1.default
        .from("bank")
        .select("balance")
        .where("account_number", "=", accountNumber)
        .decrement("balance", money);
    return amount;
});
exports.withdraw = withdraw;
// FUNCTION exported to controller for a user transfering funds.
const transfer = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderAcc, receiverAcc, amount } = transaction;
    yield db_1.default.transaction((tranx) => {
        db_1.default.from("bank")
            .transacting(tranx)
            .where("account_number", "=", senderAcc)
            .decrement("balance", amount)
            .then(tranx.commit)
            .catch(() => {
            tranx.rollback();
        });
    });
    yield db_1.default.transaction((tranx) => {
        db_1.default.from("bank")
            .transacting(tranx)
            .where("account_number", "=", receiverAcc)
            .increment("balance", amount)
            .then(tranx.commit)
            .catch(() => {
            tranx.rollback();
        });
    });
    return transaction;
});
exports.transfer = transfer;
// FUNCTION exported to controller file for validating a user's login credentials.
const validate = (obj) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(3).max(225).required(),
    });
    return schema.validate(obj);
};
exports.validate = validate;
