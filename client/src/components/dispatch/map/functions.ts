import L from "leaflet";
import { XYZ } from "./interfaces";

export const GAME = {
  x_1: -4000.0 - 230,
  y_1: 8000.0 + 420,
  x_2: 400.0 - 30,
  y_2: -300.0 - 340.0,
};

export function getMapBounds(map: L.Map) {
  const h = 1024 * 3;
  const w = 1024 * 2;

  const sw = map.unproject([0, h], 0);
  const ne = map.unproject([w, 0], 0);

  return new L.LatLngBounds(sw, ne);
}

export function convertToMap(x: number, y: number, map: L.Map) {
  const h = 1024 * 3;
  const w = 1024 * 2;

  const latLng1 = map.unproject([0, 0], 0);
  const latLng2 = map.unproject([w / 2, h - 1024], 0);

  if (!latLng1) return console.error("Could not get latlng 1");
  if (!latLng2) return console.error("Could not get latlng 2");

  const rLng = latLng1.lng + ((x - GAME.x_1) * (latLng1.lng - latLng2.lng)) / (GAME.x_1 - GAME.x_2);
  const rLat = latLng1.lat + ((y - GAME.y_1) * (latLng1.lat - latLng2.lat)) / (GAME.y_1 - GAME.y_2);
  return {
    lat: rLat,
    lng: rLng,
  };
}

export function stringCoordToFloat(coord: XYZ) {
  return {
    x: parseFloat(`${coord.x}`),
    y: parseFloat(`${coord.y}`),
    z: parseFloat(`${coord.z}`),
  };
}

export function createCluster() {
  return L.markerClusterGroup({
    maxClusterRadius: 20,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
  });
}
