import Location from "@/models/location.model";
import ParkingLot from "@/models/parking-lot.model";
import { Request, Response } from "express";
import { LocationPayload, ParkingLotPayload } from "types";
import { AnyZodObject, z, ZodTypeAny } from "zod";

const validateCreateData = (body: AnyZodObject) => {
  const schema = z.object<Record<keyof ParkingLotPayload, ZodTypeAny>>({
    capacity: z.number().min(1),
    fee: z.number(),
    location: z.object<Record<keyof LocationPayload, ZodTypeAny>>({
      city: z.string(),
      country: z.string(),
      lat: z.number(),
      lng: z.number(),
      street: z.string(),
    }),
    name: z.string(),
  });

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
    const { body } = req;

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
