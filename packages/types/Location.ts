import { BaseEntity, Payload } from ".";

export interface LocationDTO extends BaseEntity {
  street?: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export interface LocationPayload extends Payload<LocationDTO> {}
