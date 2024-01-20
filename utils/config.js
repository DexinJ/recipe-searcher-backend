const {
  JWT_SECRET = "secret",
  CONNECTION = "mongodb://127.0.0.1:27017/wimf_db",
} = process.env;

module.exports = { JWT_SECRET, CONNECTION };
