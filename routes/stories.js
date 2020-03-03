const router = require("express").Router();
const storyModel = require("../models/Story");
const {
    ensureAuthenticated,
    reverseAuthenticated
} = require("../helpers/ensureAuth");

router.get("/", (req, res) => {
    storyModel
        .find({ status: "Public" })
        //here name will be same as model name
        .populate("user")
        .sort({ date: -1 })
        .then(story => {
            res.render("stories/index", {
                story
            });
        })
        .catch(err => res.send(err));
});

router.post("/", ensureAuthenticated, async(req, res) => {
    let allowcom;
    if (req.body.allowcomments) {
        allowcom = true;
    } else {
        allowcom = false;
    }
    try {
        let story = await storyModel.create({
            title: req.body.title,
            body: req.body.editor1,
            status: req.body.status,
            allowComments: allowcom,
            user: req.user.id
        });

        res.redirect(`/stories/single/${story.id}`);
    } catch (err) {
        res.send(err);
    }
});

router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("stories/add");
});

router.get("/single/:id", (req, res) => {
    storyModel
        .findOne({ _id: req.params.id })
        .populate("user")
        .populate("comments.commentUser")
        .then(story => {
            if (story.status === "Public") {
                res.render("stories/single", {
                    story
                });
            } else {
                if (req.user) {
                    if (req.user.id == story.user._id) {
                        res.render("stories/single", {
                            story
                        });
                    } else {
                        res.redirect("/stories");
                    }
                } else {
                    res.redirect("/stories");
                }
            }
        })
        .catch(err => res.send(err));
});

router.get("/user/:id", (req, res) => {
    storyModel
        .find({ user: req.params.id, status: "Public" })
        .populate("user")
        .then(story => {
            res.render("stories/index", {
                story
            });
        })
        .catch(err => res.send(err));
});

router.get("/my", ensureAuthenticated, (req, res) => {
    storyModel
        .find({ user: req.user.id })
        .populate("user")
        .then(story => {
            res.render("stories/index", {
                story
            });
        })
        .catch(err => res.send(err));
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    storyModel
        .findOne({ _id: req.params.id })
        .then(storyy => {
            if (storyy.user != req.user.id) {
                res.redirect("/stories");
            } else {
                res.render("stories/edit", {
                    storyy
                });
            }
        })
        .catch(err => res.send(err));
});

router.post("/:id", ensureAuthenticated, (req, res) => {
    let allowcom;
    if (req.body.allowcomments) {
        allowcom = true;
    } else {
        allowcom = false;
    }
    storyModel
        .updateOne({ _id: req.params.id }, {
            title: req.body.title,
            body: req.body.editor1,
            status: req.body.status,
            allowComments: allowcom
        })
        .then(data => res.redirect("/dashboard"))
        .catch(Err => res.send(Err));
});

router.delete("/del/:id", ensureAuthenticated, (req, res) => {
    storyModel
        .deleteOne({ _id: req.params.id })
        .then(data => res.redirect("/dashboard"))
        .catch(err => res.send(err));
});

router.post("/comment/:id", ensureAuthenticated, (req, res) => {
    let newComments = {
        commentBody: req.body.comment,
        commentUser: req.user.id
    };
    storyModel.findOne({ _id: req.params.id }).then(data => {
        data.comments.unshift(newComments);
        data.save().then(story => res.redirect(`/stories/single/${story.id}`));
    });
});
module.exports = router;