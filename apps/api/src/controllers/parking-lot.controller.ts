import Location from "@/models/location.model";
import ParkingLot from "@/models/parking-lot.model";
import { Request, Response } from "express";
import { LocationPayload, ParkingLotPayload } from "types";
import { z, ZodTypeAny } from "zod";

const validateCreateData = (body: ParkingLotPayload, optional?: boolean) => {
  let schema = z.object<Record<keyof ParkingLotPayload, ZodTypeAny>>({
    capacity: z.number().min(1),
    fee: z.number(),
    name: z.string(),
    location: z.object<Record<keyof LocationPayload, ZodTypeAny>>({
      city: z.string(),
      country: z.string(),
      lat: z.number(),
      lng: z.number(),
      street: z.string(),
    }),
  });

  if (optional) {
    schema = schema.deepPartial();
  }

  return schema.safeParse(body);
};

export const getParkingLots = async (req: Request, res: Response) => {
  try {
    const parkingLots = await ParkingLot.findAll({
      include: [Location],
      attributes: { exclude: ["locationId"] },
    });

    return res.status(200).json(parkingLots);
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  }
};

export const createParkingLot = async (req: Request, res: Response) => {
  try {
    const body: ParkingLotPayload = req.body;

    const validation = validateCreateData(body);

    if (!validation.success) {
      return res.status(400).json({ message: validation.error.flatten() });
    }

    const location = await Location.create(body.location);
    const parkingLot = await ParkingLot.create({
      capacity: body.capacity,
      fee: body.fee,
      name: body.name,
      locationId: location.dataValues.id,
    });

    return res.status(200).json({ id: parkingLot.dataValues.id });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  }
};

export const editParkingLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body: ParkingLotPayload = req.body;

    const validation = validateCreateData(body, true);

    if (!validation.success) {
      return res.status(400).json({ message: validation.error.flatten() });
    }

    const parkingLot = await ParkingLot.findByPk(id);

    if (!parkingLot)
      return res
        .status(404)
        .json({ message: `Parking lot with id ${id} does not exist.` });

    Object.entries(body).map(async ([key, value]) => {
      if (key === "location") {
        const location = await Location.findByPk(
          parkingLot.dataValues.locationId
        );

        if (!location) return;

        location.set(body.location ?? {});
        await location.save();

        return;
      }

      await parkingLot.update({ [key]: value });
    });

    await parkingLot.save();

    return res.status(200).json({ message: "The parking lot was updated." });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  }
};

export const reserveParkingLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parkingLot = await ParkingLot.findByPk(id);

    if (!parkingLot)
      return res
        .status(404)
        .json({ message: `Parking lot with id ${id} does not exist.` });

    if (
      parkingLot.dataValues.occupiedSpaces != undefined &&
      parkingLot.dataValues.capacity != undefined &&
      parkingLot.dataValues.occupiedSpaces >= parkingLot.dataValues.capacity
    ) {
      return res
        .status(401)
        .json({ message: `Parking lot with id ${id} is at full capacity.` });
    }

    await parkingLot.increment("occupiedSpaces");

    return res
      .status(200)
      .json({ message: "You have reserved the parking lot!" });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  }
};

export const deleteParkingLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parkingLot = await ParkingLot.findByPk(id);

    if (!parkingLot)
      return res
        .status(404)
        .json({ message: `Parking lot with id ${id} does not exist.` });

    await Location.destroy({
      where: { $id$: parkingLot.dataValues.locationId },
    });
    await parkingLot.destroy();

    return res.status(200).json({ message: "Parking lot was deleted." });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  }
};
