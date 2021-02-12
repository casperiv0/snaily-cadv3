import * as React from "react";
import L from "leaflet";
// import J from "jquery";
import "leaflet.markercluster";
import Logger from "../../lib/Logger";
import {
  Player,
  DataActions,
  MarkerPayload,
  CustomMarker,
} from "../../components/dispatch/map/interfaces";
import {
  getMapBounds,
  convertToMap,
  stringCoordToFloat,
  createCluster,
} from "../../components/dispatch/map/functions";

/* MOST CODE IN THIS FILE IS FROM TGRHavoc/live_map-interface, SPECIAL THANKS TO HIM FOR MAKING THIS! */
/* STATUS: NOT COMPLETE */

const TILES_URL = "/tiles/minimap_sea_{y}_{x}.png";

export default function Map() {
  const [MarkerStore, setMarkerStore] = React.useState<CustomMarker[]>([]);
  const [map, setMap] = React.useState<L.Map | null>(null);
  const [PlayerMarkers] = React.useState<L.Layer>(createCluster());
  const [ran, setRan] = React.useState(false);
  const socket = React.useMemo(() => new WebSocket("ws://localhost:30121"), []);

  React.useEffect(() => {
    socket.onclose = () => {
      Logger.log("LIVE_MAP", "Disconnected from live-map");
    };

    socket.onerror = (e) => {
      Logger.log("LIVE_MAP", `${e}`);
    };

    socket.onmessage = (e: MessageEvent) => {
      onMessage(e);
    };
  }, [map, onMessage]);

  React.useEffect(() => {
    if (ran) return;
    setRan(true);
    const TileLayer = L.tileLayer(TILES_URL, {
      minZoom: -2,
      maxZoom: 2,
      tileSize: 1024,
      maxNativeZoom: 0,
      minNativeZoom: 0,
    });

    const map = L.map("map", {
      crs: L.CRS.Simple,
      layers: [TileLayer],
      zoomControl: false,
    }).setView([0, 0], 0);

    const bounds = getMapBounds(map);

    map.setMaxBounds(bounds);
    map.fitBounds(bounds);
    map.addLayer(PlayerMarkers);

    setMap(map);
  }, [ran, PlayerMarkers]);

  function onMessage(e: MessageEvent) {
    const data = JSON.parse(e.data) as DataActions;

    switch (data.type) {
      case "playerLeft": {
        console.log(data);

        const marker = MarkerStore.find((marker) => {
          return marker.payload.player?.identifier === data.payload;
        });

        setMarkerStore((prev) => {
          return prev.filter((marker) => {
            return marker.payload.player?.identifier !== data.payload;
          });
        });

        marker?.removeFrom(map!);
        break;
      }
      case "playerData": {
        data.payload.forEach((player: Player) => {
          if (!player.identifier) return;
          if (!player.name) return;

          const marker = MarkerStore.find((marker) => {
            return marker.payload?.player?.identifier === player.identifier;
          });

          if (marker) {
            const coords = stringCoordToFloat(player.pos);
            const converted = convertToMap(coords.x, coords.y, map!);
            if (!converted) return;
            marker.setLatLng(converted);
          } else {
            createMarker(
              false,
              {
                description: "Hello world",
                pos: player.pos,
                title: player.name,
                isPlayer: true,
                player,
                id: MarkerStore.length,
              },
              player?.name,
            );
          }
        });

        return;
      }
      default: {
        return;
      }
    }
  }

  function createMarker(draggable: boolean, payload: MarkerPayload, title: string) {
    if (map === null) return;
    const coords = stringCoordToFloat(payload.pos);
    const converted = convertToMap(coords.x, coords.y, map);
    if (!converted) return;

    const infoContent =
      '<div class="info-window"><div class="info-header-box"><div class="info-header">' +
      title +
      '</div></div><div class="clear"></div><div class=info-body>' +
      "<p>Hello from popup</p>" +
      "</div></div>";

    const where = payload.isPlayer ? PlayerMarkers : map;

    const marker: CustomMarker = (L as any)
      .marker(converted, {
        title,
        draggable,
      })
      .addTo(where)
      .bindPopup(infoContent);

    marker.payload = payload;

    setMarkerStore((prev) => {
      return [...prev, marker];
    });

    return MarkerStore.length;
  }

  return (
    <>
      <div id="map" style={{ zIndex: 1, height: "calc(100vh - 58px)", width: "100vw" }}></div>
    </>
  );
}
