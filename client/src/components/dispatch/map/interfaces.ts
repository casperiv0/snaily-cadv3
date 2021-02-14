import Call from "../../../interfaces/Call";

export interface Player {
  Weapon?: string;
  Vehicle?: string;
  "License Plate"?: string;
  Location: string;
  pos: XYZ;
  identifier: string;
  icon: string;
  name: string;
  leo?: boolean;
  ems_fd?: boolean;
}

export type DataActions =
  | {
      type: "playerLeft";
      payload: string;
    }
  | {
      type: "playerData";
      payload: Player[];
    };

export interface XYZ {
  x: number | null;
  y: number | null;
  z: number | null;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerPayload {
  pos: XYZ | LatLng;
  icon: L.IconOptions | null;
  description: string;
  title: string;
  isPlayer?: boolean;
  player?: Player;
  call?: Call;
  id: number;
}

export interface CustomMarker extends L.Marker {
  payload: MarkerPayload;
}

export const defaultTypes = {
  6: {
    iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png",
    iconSize: [25, 41],
    popupAnchor: [0, 0],
    iconAnchor: [11, 0],
  },
};
