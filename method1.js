// mongooes connection is not with-in connect-mongodb-session and express-sesion

const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const UserModel = require("./model/users");
var MongoDBStore = require("connect-mongodb-session")(session);
var bcrypt = require("bcrypt");

const app = express();

const uri = "mongodb://localhost... OR mongodb+srv://user_Or_password....";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("connected with mongoose"));

var store = new MongoDBStore({
  uri: uri,
  collection: "myCollectionName",
  databaseName: "myDatabaseName",
});

app.use(
  session({
    secret: "My Secret",
    saveUninitialized: true,
    store: store,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// to check whether user is already login or not
const isAuth = (req, res, next) => {
  if (req.session.isAuth) next();
  else {
    res.redirect("/login");
    next();
  }
};

app.use(express.urlencoded({ extended: false }));

app.set("view-engine", "ejs");

app.get("/", isAuth, async (req, res) => {
  res.render("./index.ejs", { name: "Your Name" });
});

app.post("/", (req, res) => {
  req.session.destroy((e) => {
    if (e) throw e;
    res.redirect("/login");
  });
});

app.get("/login", (req, res) => {
  res.render("./login.ejs");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // finding the user on bases of email
  let user = await UserModel.findOne({ email });

  if (!user) return res.redirect("/login");

  const matchPassowrd = await bcrypt.compare(password, user?.password);

  if (!matchPassowrd) return res.redirect("/login");

  req.session.isAuth = true;

  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("./register.ejs");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await UserModel.findOne({ email });

  if (user) return res.redirect("/register");

  let hashedPassword = await bcrypt.hash(password, 10);

  user = new UserModel({
    username: name,
    email: email,
    password: hashedPassword,
  });

  user.save();

  res.redirect("/login");
});

app.listen(4000, () => {
  console.log("\nListening to Port 4000...\n");
});
