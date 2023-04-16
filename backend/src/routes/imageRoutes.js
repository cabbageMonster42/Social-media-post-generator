 
const Router = require("koa-router");
const imageController = require("../controllers/imageController");

const router = new Router("/runpod/sd");

router.post("/image", imageController.generateImage );

module.exports = router;