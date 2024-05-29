const express = require("express");
const router = express.Router();
const postsControllers = require("../controllers/posts");

const multer = require("multer");
const uploader = multer({ dest: "public" });

router.get("/", postsControllers.index);

router.post("/create", uploader.single("image"), postsControllers.create);

router.get("/:slug", postsControllers.show);

router.get("/:slug/download", postsControllers.download);

router.delete("/:slug", postsControllers.destroy);

module.exports = router;