export type Mission = {
  id: String;
  title: String;
  operator: String;
  launch: Launch;
  orbit: Orbit;
  payload: Payload;
}

export type Launch = {
  date: Date;
  vehicle: String;
  location: Location;
}

export type Location = {
  name: String;
  longitude: Number;
  latitude: Number;
}

export type Orbit = {
  periapsis: Number;
  apoapsis: Number;
  inclination: Number;
}

export type Payload = {
  capacity: Number;
  available: Number;
}


export enum Type {
  sunlight,
  wind,
  kerosene,
  electricity
}
export type Delivery = {
  type: Type;
  quantity: Number;
  unit: String;
  icon: String;
}

export type DeliveryDate = {
  date: String;
  deliveries: Delivery[];
}
