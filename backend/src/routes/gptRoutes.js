const Router = require("koa-router");
const gptController = require("../controllers/gptController");

const router = new Router("/api/gpt");

router.post("/generate", gptController.generateText );

module.exports = router;