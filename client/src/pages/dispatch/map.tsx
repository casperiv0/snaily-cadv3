import L from "leaflet";
import { useCallback, useEffect, useState } from "react";

/* MOST CODE IN THIS FILE IS FROM TGRHavoc/live_map-interface, SPECIAL THANKS TO HIM FOR MAKING THIS! */
/* STATUS: NOT COMPLETE YET */

// TODO: set map loading
// Check if map is 'ready'
// Add blips
// refactor

const TILES_URL = "/tiles/minimap_sea_{y}_{x}.png";

export default function Map() {
  const [ran, setRan] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);
  const CurrentLayer = tileLayers();

  const init = useCallback(() => {
    setRan(true);
    const map = L.map("map", {
      crs: L.CRS.Simple,
      layers: [CurrentLayer],
    }).setView([0, 0], 0);

    const bounds = getMapBounds(map);

    map.setMaxBounds(bounds);
    map.fitBounds(bounds);

    setMap(map);
  }, [CurrentLayer]);

  const doSom = useCallback(() => {
    const loc = map && convertToMap(2000, 5000, map);

    console.log(map);

    console.log(loc);

    map &&
      L.marker(
        {
          lat: loc?.lat!,
          lng: loc?.lng!,
        },
        {
          title: "Hello world",
        },
      )
        .addTo(map!)
        .bindPopup("<p>Hello from the first pin!</p>");
  }, [map]);

  useEffect(() => {
    ran === false && init();
  }, [init, ran]);

  useEffect(() => {
    setTimeout(() => {
      map && doSom();
    }, 1500);
  }, [doSom, map]);

  function getMapBounds(map: L.Map) {
    const h = 1024 * 3;
    const w = 1024 * 2;

    const southWest = map.unproject([0, h], 0);
    const northEast = map.unproject([w, 0], 0);

    return new L.LatLngBounds(southWest, northEast);
  }

  return <div id="map" style={{ height: "calc(100vh - 58px)", width: "100vw" }}></div>;
}

// Top left corner of the GTA Map
const GAME_1_X = -4000.0 - 230;
const GAME_1_Y = 8000.0 + 420;

const GAME_2_X = 400.0 - 30;
const GAME_2_Y = -300.0 - 340.0;

function convertToMap(x: number, y: number, map: L.Map | null) {
  const h = 1024 * 3;
  const w = 1024 * 2;

  const latLng1 = map?.unproject([0, 0], 0);
  const latLng2 = map?.unproject([w / 2, h - 1024], 0);

  if (!latLng1) return;
  if (!latLng2) return;

  const rLng = latLng1.lng + ((x - GAME_1_X) * (latLng1.lng - latLng2.lng)) / (GAME_1_X - GAME_2_X);
  const rLat = latLng1.lat + ((y - GAME_1_Y) * (latLng1.lat - latLng2.lat)) / (GAME_1_Y - GAME_2_Y);
  return {
    lat: rLat,
    lng: rLng,
  };
}

function tileLayers() {
  return L.tileLayer(TILES_URL, {
    minZoom: -2,
    maxZoom: 2,
    tileSize: 1024,
    maxNativeZoom: 0,
    minNativeZoom: 0,
  });
}
