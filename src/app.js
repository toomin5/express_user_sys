import "dotenv/config";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

import userController from "./controllers/userController.js";

import productController from "./controllers/productController.js";
import reviewController from "./controllers/reviewController.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
  })
);

//쿠키 캐싱방지 위해 rest-client.remember false추가

app.use(express.json());
app.use(cookieParser());

app.use("", userController);
app.use("/products", productController);
app.use("/reviews", reviewController);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
