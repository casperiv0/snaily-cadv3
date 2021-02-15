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
  x: number | undefined;
  y: number | undefined;
  z: number | undefined;
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
  player?: Player;
  call?: Call;
  id: string;

  isPlayer?: boolean;
  isBlip?: boolean;
}

export interface CustomMarker extends L.Marker {
  payload: MarkerPayload;
}

export interface Blip {
  pos: XYZ;
  icon: L.IconOptions;
  description: string;
  name: string;
  type: any;
  markerId: number;
  x?: number;
  y?: number;
  z?: number;
}

export const defaultTypes = {
  0: {
    iconUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=",
    iconSize: [0, 0],
    popupAnchor: [0, 0],
    iconAnchor: [0, 0],
  },
  999: {
    iconUrl: "/map/debug.png",
    iconSize: [23, 32],
    popupAnchor: [0, 0],
    iconAnchor: [11.5, 0], // Bottom middle
  },
  6: {
    iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png",
    iconSize: [25, 41],
    popupAnchor: [0, 0],
    iconAnchor: [11, 0],
  },
};
