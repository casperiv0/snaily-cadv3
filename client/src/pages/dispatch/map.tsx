// import L from "leaflet";
// import "leaflet.markercluster";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   tileLayers,
//   getMapBounds,
//   createMarker,
//   removeMarker,
// } from "../../components/dispatch/map/functions";
// import { Data, Marker, Payload } from "../../components/dispatch/map/interfaces";
// import Loader from "../../components/loader";
// import Logger from "../../lib/Logger";

// /* MOST CODE IN THIS FILE IS FROM TGRHavoc/live_map-interface, SPECIAL THANKS TO HIM FOR MAKING THIS! */
// /* STATUS: NOT COMPLETE */

// // TODO:
// // Add blips
// // refactor

// export let MarkerStore: Marker[] = [];
// export const PlayerMarkers = L.markerClusterGroup({
//   maxClusterRadius: 20,
//   spiderfyOnMaxZoom: false,
//   showCoverageOnHover: false,
//   zoomToBoundsOnClick: false,
// });

// export default function Map() {
//   const socket = useMemo(() => new WebSocket("ws://localhost:30121"), []);
//   const [ran, setRan] = useState(false);
//   const [map, setMap] = useState<L.Map | null>(null);
//   const [ready, setReady] = useState<boolean>(false);
//   const [marker] = useState<L.Marker | null>(null);
//   const CurrentLayer = tileLayers();

//   const init = useCallback(() => {
//     setRan(true);
//     const m = L.map("map", {
//       crs: L.CRS.Simple,
//       layers: [CurrentLayer],
//       minZoom: -2,
//       maxZoom: 2,
//       bounceAtZoomLimits: false,
//       preferCanvas: true,
//     }).setView([0, 0], 0);

//     const bounds = getMapBounds(m);

//     m.setMaxBounds(bounds);
//     m.fitBounds(bounds);
//     // m.addLayer(PlayerMarkers);

//     m.whenReady(() => {
//       setReady(true);
//       setMap(m);
//     });
//   }, [CurrentLayer]);

//   useEffect(() => {
//     socket.onmessage = async (e) => {
//       marker && map?.removeLayer(marker!);

//       map && onMessage(e, map);
//     };
//   }, [socket, map, marker]);

//   useEffect(() => {
//     return () => {
//       Logger.log("live_map", "Disconnected from LiveMap socket");
//       socket.close();
//     };
//   }, [socket]);

//   useEffect(() => {
//     ran === false && init();
//   }, [init, ran]);

//   return (
//     <>
//       {!ready ? <Loader fullScreen /> : null}
//       <div id="map" style={{ zIndex: 1, height: "calc(100vh - 58px)", width: "100vw" }}></div>
//     </>
//   );
// }

// async function onMessage(e: any, map: L.Map) {
//   const data: Data = JSON.parse(e.data);
//   // const loc = convertToMap(data.payload[0].pos.x, data.payload[0].pos.y, map);
//   console.log(data);

//   switch (data.type) {
//     case "addBlip": {
//       addBlip(data.payload, map);
//       return;
//     }
//     case "playerData": {
//       removeBlip(data.payload, map);
//       addBlip(data.payload, map);
//       return;
//     }
//     case "playerLeft": {
//       removeBlip(data.payload, map);
//       return;
//     }
//     default: {
//       return "Not allowed";
//     }
//   }
// }

// function addBlip(payload: Payload[], map: L.Map) {
//   payload?.forEach((p) => {
//     createMarker(p, p?.name, map);
//   });
// }

// function removeBlip(payload: Payload[] | string, map: L.Map) {
//   let nw = MarkerStore;
//   if (typeof payload === "string") {
//     nw = removeMarker(payload, map);
//   } else {
//     payload.map((p) => {
//       const newStore = removeMarker(p?.identifier, map);
//       if (typeof newStore === "object") {
//         nw = newStore;
//       }
//     });
//   }

//   MarkerStore = nw;
// }

export {};
