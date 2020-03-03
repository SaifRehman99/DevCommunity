const router = require("express").Router();
const passport = require("passport");

// getting the user profile(img, data, etc) email
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect("/dashboard");
    }
);

router.get("/verify", (req, res) => {
    if (req.user) {
        console.log(req.user);
    } else {
        console.log("NO auth");
    }
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;