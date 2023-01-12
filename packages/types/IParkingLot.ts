import { ILocation } from ".";

export interface IParkingLot {
  name?: string;
  capacity?: number;
  fee?: number;
  location?: ILocation;
}
