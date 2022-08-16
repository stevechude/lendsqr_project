import express from 'express';
import logger from "morgan";
import accountsRouter from "./routes/accounts_routes";

require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.json());

// ROUTE MIDDLEWARE
app.use("/", accountsRouter);


const PORT = process.env.PORT || 3005;

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));