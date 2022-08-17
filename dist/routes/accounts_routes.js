"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accounts_controller_1 = require("../controllers/accounts_controller");
const router = express_1.default.Router();
router.post("/accounts", accounts_controller_1.createUserAccount);
router.post("/login", accounts_controller_1.login);
router.post("/accounts/credit", accounts_controller_1.protect, accounts_controller_1.creditAccount);
router.post("/accounts/withdraw", accounts_controller_1.protect, accounts_controller_1.withdrawFromAccount);
router.post("/accounts/transfer", accounts_controller_1.protect, accounts_controller_1.accountTransactions);
router.get("/accounts/fetch", accounts_controller_1.getAllUserAccounts);
// router.get() protect
exports.default = router;
