import express, { ErrorRequestHandler } from "express";
import createHttpError from "http-errors";
import userRoute from "./routes/userRoutes";
import mongoose from "mongoose";
import { DB, PORT } from "./config";
import { errorHandler } from "./middleware/errorHanlder";
import passport from "passport";
import kPassport from "./middleware/passport";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
kPassport(passport);

app.use("/user", userRoute);

app.use(() => {
  throw createHttpError(404, "Route not found");
});

app.use(errorHandler);
mongoose.set('strictQuery', false);
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to db");
    app.listen(PORT, () => {
      console.log(`Listening On PORT ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Unable to connect database");
  });
