import express, { NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { Request, Response } from "express";
import path from "path";
import { limiter } from "./middlewares/rateLimiter";
import routes from "./routes/v1/web";
import cookieParser from "cookie-parser";
import i18next from "i18next";
import middleware from "i18next-http-middleware";
import { profile } from "console";
import {
  createOrUpdateSettingStatus,
  getSettingStatus,
} from "./services/settingService";

//import * as errorController from "./controllers/web/errorControllers";

export const app = express();

var whiteList = ["http://example1.com", "http://localhost:5173"];
var corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void
  ) {
    if (!origin) return callback(null, true);
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(cookieParser());
app.use(routes);
app.use(middleware.handle(i18next));

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  const errorCode = error.code || "Error_Code";
  res.status(status).json({
    message,
    error: errorCode,
  });
});
