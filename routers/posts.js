const express = require("express");
const router = express.Router();
const postsControllers = require("../controllers/posts.js");
const usersControllers = require("../controllers/users.js");
const auth = require("../middlewares/auth.js");

const multer = require("multer");
const uploader = multer({ dest: "public" });


router.get("/", postsControllers.index);

router.post("/create", (auth.authenticateWithJwt), (auth.isAdmin), uploader.single("image"), postsControllers.create);

router.get("/:slug", postsControllers.show);

router.get("/:slug/download", postsControllers.download);

router.delete("/:slug", postsControllers.destroy);

router.post('/login', usersControllers.login);


module.exports = router;
