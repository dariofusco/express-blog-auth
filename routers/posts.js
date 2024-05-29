const express = require("express");
const router = express.Router();
const postsControllers = require("../controllers/posts.js");
const authControllers = require("../controllers/auth.js");
const auth = require("../middlewares/auth.js");

const multer = require("multer");
const uploader = multer({ dest: "public" });


router.get("/", postsControllers.index);

router.post("/create", (auth.authenticateWithJwt), uploader.single("image"), postsControllers.create);

router.get("/:slug", postsControllers.show);

router.get("/:slug/download", postsControllers.download);

router.delete("/:slug", postsControllers.destroy);

router.post('/login', authControllers.login);


module.exports = router;
