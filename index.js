const express = require("express");
const app = express();
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const passport = require("passport");
const DB = require("./config/db");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const {
    truncate,
    stripTags,
    formateDate,
    select,
    editIcon
} = require("./helpers/hbs");

// configure the DB here
DB();

// for the handlebars errors
const {
    allowInsecurePrototypeAccess
} = require("@handlebars/allow-prototype-access");

// handlebars middleware here
app.engine(
    "handlebars",
    exphbs({
        helpers: {
            truncate,
            stripTags,
            formateDate,
            select,
            editIcon
        },
        defaultLayout: "main.handlebars",
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    })
);
app.set("view engine", "handlebars");

// middleware for the body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static folder here
app.use(express.static(path.join(__dirname, "public")));

// cookier parser
app.use(cookieParser());

// using the session middleware here for saving the state of login user :)
app.use(
    // generate the secret key random for more secure
    session({
        secret: "KEYBOARD",
        // resave if nothing is change
        resave: false,
        // save empty value?
        saveUninitialized: false
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// global messages here
app.use(function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// passport google here
require("./config/passport")(passport);

// routes here
app.use("/stories", require("./routes/stories"));
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 9999;

app.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));