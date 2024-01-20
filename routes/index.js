const router = require("express").Router();
const NotFoundError = require("../Errors/NotFoundError");
const auth = require("../middlewares/auth");
const userRouter = require("./users");

router.use("/users", auth, userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
