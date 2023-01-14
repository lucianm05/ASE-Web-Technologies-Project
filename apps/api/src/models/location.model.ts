import sequelize from "@/db";
import { DataTypes, Model } from "sequelize";
import { LocationDTO } from "types";

const Location = sequelize.define<Model<LocationDTO>>("location", {
  city: { type: DataTypes.STRING, defaultValue: "" },
  country: { type: DataTypes.STRING, defaultValue: "" },
  lat: { type: DataTypes.DECIMAL, defaultValue: 0 },
  lng: { type: DataTypes.DECIMAL, defaultValue: 0 },
  street: { type: DataTypes.STRING, defaultValue: "" },
});

export default Location;
