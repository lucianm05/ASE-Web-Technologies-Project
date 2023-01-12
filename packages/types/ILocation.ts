export interface ICoords {
  lat?: number;
  lng?: number;
}

export interface ILocation {
  street?: string;
  city?: string;
  country?: string;
  coords?: ICoords;
}
