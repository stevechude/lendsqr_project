"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const accounts_routes_1 = __importDefault(require("./routes/accounts_routes"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// ROUTE MIDDLEWARE
app.use("/", accounts_routes_1.default);
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
