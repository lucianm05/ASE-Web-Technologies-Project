import { LocationDTO, BaseEntity, Payload } from ".";

export interface ParkingLotDTO extends BaseEntity {
  name?: string;
  capacity?: number;
  fee?: number;
  location?: LocationDTO;
}

export interface ParkingLotPayload extends Payload<ParkingLotDTO> {}
