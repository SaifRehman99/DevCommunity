const router = require("express").Router();
const storyModel = require("../models/Story");

const {
    ensureAuthenticated,
    reverseAuthenticated
} = require("../helpers/ensureAuth");

router.get("/", reverseAuthenticated, (req, res) => {
    res.render("index/welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
    storyModel
        .find({ user: req.user.id })
        .then(stories => {
            res.render("index/dashboard", {
                stories
            });
        })
        .catch(Err => res.send(Err));
});

module.exports = router;