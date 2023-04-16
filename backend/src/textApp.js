const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const gptRoutes = require("./routes/gptRoutes");
// const errorHandling = require("./middleware/errorHandling");

const app = new Koa();

// Middleware
app.use(cors());
app.use(bodyParser());
// app.use(errorHandling);

// Routes
app.use(gptRoutes.routes()).use(gptRoutes.allowedMethods());
// app.use(imageRoutes.routes()).use(imageRoutes.allowedMethods());

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
