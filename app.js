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
const rateLimiter = require("./utils/rateLimiter");
const { validateSignUp, validateLogIn } = require("./middlewares/validation");
const { CONNECTION } = require("./utils/config");

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect(CONNECTION);
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
app.use(rateLimiter);
app.post("/signup", validateSignUp, createUser);
app.post("/signin", validateLogIn, login);

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
console.log("App listening at PORT 3001");
