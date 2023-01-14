require("dotenv").config();
import { config } from "config";
import express, { Express } from "express";
import sequelize from "./src/db";
import cors from "cors";

import parkingLotRoutes from "./src/routes/parking-lot.route";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origin !== config.WEB_URL)
        return callback(new Error("Not allowed by CORS"));

      return callback(null, true);
    },
  })
);

app.use("/parking-lot", parkingLotRoutes);

app.listen(config.API_PORT, async () => {
  try {
    await sequelize.sync();
    console.log("Sequelize synced");
  } catch (err) {
    console.error("Error syncing sequelize");
    console.error(err);
  }
  console.log(`API started on port ${config.API_PORT}`);
});
