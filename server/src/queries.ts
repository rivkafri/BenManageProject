import { v4 as uuidv4 } from "uuid";
import { createHash } from "crypto";
import { Mission } from "./types";

export const ListMissions = (missions: Mission[], args: any) => {
  if (args.sort) {
    missions.sort((aMission: Mission, bMission: Mission) => {
      let a: String | Date, b: String | Date;
      switch (args.sort?.field) {
        case "Title":
          a = aMission.title;
          b = bMission.title;
          break;
        case "Date":
          a = new Date(aMission.launch.date);
          b = new Date(bMission.launch.date);
          break;
        case "Operator":
          a = aMission.operator;
          b = bMission.operator;
          break;
        default:
          a = "";
          b = "";
      }
      if (args.sort?.desc === true) {
        return a < b ? 1 : -1;
      } else {
        return a > b ? 1 : -1;
      }
    });
  }
  return missions;
};

export const GetMissionById = (missions: Mission[], id: String) => {
  return missions.find((mission: Mission) => mission.id === id);
};

export const CreateMission = (mission: Mission): Mission => {
  mission.id = createHash("sha256")
    .update(uuidv4())
    .digest("hex")
    .substring(32);

  return mission;
};

export const EditMission = (mission: Mission, args: any): Mission => {
  mission!.title = args.title;
  mission!.operator = args.operator;
  mission!.launch.date = args.launch.date;
  mission!.launch.vehicle = args.launch.vehicle;
  mission!.launch.location.name = args.launch.location.name;
  mission!.launch.location.longitude = args.launch.location.longitude;
  mission!.launch.location.latitude = args.launch.location.latitude;
  mission!.orbit.periapsis = args.orbit.periapsis;
  mission!.orbit.apoapsis = args.orbit.apoapsis;
  mission!.orbit.inclination = args.orbit.inclination;
  mission!.payload.capacity = args.payload.capacity;
  mission!.payload.available = args.payload.available;
  return mission;
};
