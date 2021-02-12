export interface Player {
  Weapon?: string;
  Vehicle?: string;
  Location: string;
  pos: XYZ;
  identifier: string;
  icon: string;
  name: string;
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
  x: number;
  y: number;
  z: number;
}

export interface MarkerPayload {
  pos: XYZ;
  // icon: number;
  description: string;
  title: string;
  isPlayer?: boolean;
  player?: Player;
  id: number;
}

export interface CustomMarker extends L.Marker {
  payload: MarkerPayload;
}
