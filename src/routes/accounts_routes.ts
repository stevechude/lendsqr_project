import express from "express";
import {
  accountTransactions,
  createUserAccount,
  creditAccount,
  getAlluserAccounts,
  login,
  protect,
  withdrawFromAccount,
} from "../controllers/accounts_controller";

const router = express.Router();

router.post("/accounts", createUserAccount);
router.post("/login", login);
router.post("/accounts/credit", protect, creditAccount);
router.post("/accounts/withdraw", protect, withdrawFromAccount);
router.post("/accounts/transfer", protect, accountTransactions);
router.get("/accounts/fetch", getAlluserAccounts);
// router.get() protect

export default router;
