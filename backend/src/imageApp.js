const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const imageRoutes = require("./routes/imageRoutes");
// const errorHandling = require("./middleware/errorHandling");

const app = new Koa();

app.use(cors());
app.use(bodyParser());
// app.use(errorHandling);

// Routes
app.use(imageRoutes.routes()).use(imageRoutes.allowedMethods());
// app.use(imageRoutes.routes()).use(imageRoutes.allowedMethods());

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
