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

export interface IIcon extends L.IconOptions {
  name?: string;
}

export interface IPopup extends L.Popup {
  payload: {
    identifier: string;
  };
}

export const defaultTypes: Record<number, IIcon> = {
  0: {
    iconUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=",
    iconSize: [0, 0],
    popupAnchor: [0, 0],
  },
  6: {
    iconUrl: "https://discord.com/assets/ccb2d2a7a4b084c98d57ab384c0267c6.svg",
    iconSize: [30, 30],
    popupAnchor: [0, 2],
  },
  // Police car
  5: {
    iconUrl: "https://discord.com/assets/c8d3385524b2681cbb83d5f6dad308a2.svg",
    iconSize: [30, 35],
    popupAnchor: [0, 0],
    shadowAnchor: [0, 0],
  },
  // Fire truck
  4: {
    iconUrl: "https://discord.com/assets/c2aef75dcc13733edda4b2bbd35509a6.svg",
    iconSize: [30, 30],
    popupAnchor: [0, 0],
  },
  // Ambulance
  3: {
    iconUrl: "https://discord.com/assets/ab136c40e0d79d1ecda361d342b53050.svg",
    iconSize: [30, 30],
    popupAnchor: [0, 0],
  },
};

export const BLIP_SIZES = {
  width: 64 / 2,
  height: 64 / 2,
};
