import express from "express";
import {
  getParkingLots,
  createParkingLot,
} from "@/controllers/parking-lot.controller";

const router = express.Router();

router.get("/", getParkingLots);
router.post("/", createParkingLot);

export default router;
