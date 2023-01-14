import sequelize from "@/db";
import Location from "@/models/location.model";
import { DataTypes, Model } from "sequelize";
import { ParkingLotDTO } from "types";

export interface ParkingLotEntity extends Omit<ParkingLotDTO, "location"> {
  locationId?: number;
}

const ParkingLot = sequelize.define<Model<ParkingLotEntity>>("parkinglot", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  capacity: { type: DataTypes.INTEGER, defaultValue: 1 },
  fee: { type: DataTypes.INTEGER, defaultValue: 0 },
  name: { type: DataTypes.STRING, defaultValue: "" },
  locationId: { type: DataTypes.INTEGER, defaultValue: null },
});

Location.hasOne(ParkingLot);
ParkingLot.belongsTo(Location);

export default ParkingLot;
