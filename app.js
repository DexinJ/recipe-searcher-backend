require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const { createUser, login } = require("./controllers/users");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/wimf_db");
app.disable("x-powered-by");

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use(requestLogger);
app.post("/signup", createUser);
app.post("/signin", login);

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
console.log("App listening at PORT 3001");
