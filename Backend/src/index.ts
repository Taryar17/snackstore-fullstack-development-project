import "dotenv/config";
import { app } from "./app";
require("dotenv").config();

const APP_PORT = process.env.APP_PORT || 4000;

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
  console.log(`ENV PORT:`, process.env.APP_PORT);
});
