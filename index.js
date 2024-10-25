const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const router = require("./routes/index.routes");
const session = require("express-session");

require("./config/dbInit")();

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", "views");

app.use("/", router);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
