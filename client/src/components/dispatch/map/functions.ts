// import L from "leaflet";
// import { Payload, Xyz } from "./interfaces";
// import { MarkerStore } from "../../../pages/dispatch/map";

// const GAME_1_X = -4000.0 - 230;
// const GAME_1_Y = 8000.0 + 420;
// const GAME_2_X = 400.0 - 30;
// const GAME_2_Y = -300.0 - 340.0;

// const TILES_URL = "/tiles/minimap_sea_{y}_{x}.png";

// export function convertToMap(x: number, y: number, map: L.Map | null) {
//   const h = 1024 * 3;
//   const w = 1024 * 2;

//   const latLng1 = map?.unproject([0, 0], 0);
//   const latLng2 = map?.unproject([w / 2, h - 1024], 0);

//   if (!latLng1) return;
//   if (!latLng2) return;

//   const rLng = latLng1.lng + ((x - GAME_1_X) * (latLng1.lng - latLng2.lng)) / (GAME_1_X - GAME_2_X);
//   const rLat = latLng1.lat + ((y - GAME_1_Y) * (latLng1.lat - latLng2.lat)) / (GAME_1_Y - GAME_2_Y);
//   return {
//     lat: rLat,
//     lng: rLng,
//   };
// }

// export function stringCoordToFloat({ x, y, z }: Xyz): Xyz {
//   return {
//     x: parseFloat(`${x}`),
//     y: parseFloat(`${y}`),
//     z: parseFloat(`${z}`),
//   };
// }

// export function tileLayers() {
//   return L.tileLayer(TILES_URL, {
//     minZoom: -2,
//     maxZoom: 2,
//     tileSize: 1024,
//     maxNativeZoom: 0,
//     minNativeZoom: 0,
//   });
// }

// export function getMapBounds(map: L.Map) {
//   const h = 1024 * 3;
//   const w = 1024 * 2;

//   const southWest = map.unproject([0, h], 0);
//   const northEast = map.unproject([w, 0], 0);

//   return new L.LatLngBounds(southWest, northEast);
// }

// export function createMarker(object: Payload, title: string, map: L.Map) {
//   while (!object?.identifier && !object.name) {
//     // wait
//     return;
//   }
//   const floats = stringCoordToFloat(object?.pos);
//   const coord = convertToMap(floats.x, floats.y, map);

//   if (!coord) {
//     return console.error({
//       error: "CANNOT_GET_COORDS",
//       msg: "An error occurred when getting the users coordinates",
//     });
//   }

//   const html =
//     '<div class="row info-body-row"><strong>Description:</strong>&nbsp;' + object?.name + "</div>";

//   const marker = L.marker(coord, {
//     title,
//   })
//     .addTo(map)
//     .bindPopup(html);

//   MarkerStore.push({
//     marker,
//     id: object?.identifier,
//     payload: object,
//   });

//   return marker;
// }

// export function removeMarker(id: string, map: L.Map) {
//   while (!MarkerStore) {
//     // wait
//     return [];
//   }

//   const marker = MarkerStore?.find((v) => `${v.id}` === `${id}`);

//   if (!marker) {
//     console.error({
//       error: "MARKER_NOT_FOUND",
//       msg: "That marker was not found",
//     });

//     return MarkerStore;
//   }

//   map.removeLayer(marker.marker);
//   MarkerStore?.[Number(id)]?.marker?.remove();

//   return MarkerStore?.filter((v) => {
//     return `${v.id}` !== `${id}`;
//   });
// }
export {};
