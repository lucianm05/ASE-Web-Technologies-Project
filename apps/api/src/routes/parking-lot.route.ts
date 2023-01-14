import {
  createParkingLot,
  deleteParkingLot,
  editParkingLot,
  getParkingLots,
  reserveParkingLot,
} from "@/controllers/parking-lot.controller";
import express from "express";

const router = express.Router();

router.get("/", getParkingLots);
router.post("/", createParkingLot);
router.put("/:id", editParkingLot);
router.patch("/:id", reserveParkingLot);
router.delete("/:id", deleteParkingLot);

export default router;
