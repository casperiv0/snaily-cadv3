import * as React from "react";
import L from "leaflet";
// import J from "jquery";
import "leaflet.markercluster";
import "../../styles/map.css";
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
import ActiveMapCalls from "../../components/dispatch/map.ActiveCalls";
import Create911Call from "../../components/modals/call911Modal";
import { connect } from "react-redux";
import { getActiveUnits } from "../../lib/actions/dispatch";
import State from "../../interfaces/State";
import CadInfo from "../../interfaces/CadInfo";
import Call from "../../interfaces/Call";

/* MOST CODE IN THIS FILE IS FROM TGRHavoc/live_map-interface, SPECIAL THANKS TO HIM FOR MAKING THIS! */
/* STATUS: NOT COMPLETE */

const TILES_URL = "/tiles/minimap_sea_{y}_{x}.png";

interface Props {
  getActiveUnits: () => void;
  cadInfo: CadInfo;
  calls: Call[];
}

function Map({ getActiveUnits, cadInfo, calls }: Props) {
  const [MarkerStore, setMarkerStore] = React.useState<CustomMarker[]>([]);
  const [map, setMap] = React.useState<L.Map | null>(null);
  const [PlayerMarkers] = React.useState<L.Layer>(createCluster());
  const [ran, setRan] = React.useState(false);
  const socket = React.useMemo(() => {
    if (!cadInfo.live_map_url) return;
    return new WebSocket(`${cadInfo.live_map_url}`);
  }, [cadInfo]);

  React.useEffect(() => {
    getActiveUnits();
  }, [getActiveUnits]);

  React.useEffect(() => {
    if (!socket) return;
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

  React.useEffect(() => {
    if (!map) return;

    calls.forEach((call) => {
      if (call.pos.x === 0) return;

      createMarker(
        true,
        {
          description: `911 Call from: ${call.name}`,
          id: MarkerStore.length,
          pos: call.pos,
          isPlayer: false,
          title: "911 Call",
        },
        call.location,
      );
    });
  }, [map, calls]);

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
                // icon: 6,
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

      <div className="map-blips-container">
        <button className="btn btn-primary mx-2">
          {/* {showBlips ? "Hide blips" : "Show blips"} */}
          Show/hide blips
        </button>
        <button data-bs-toggle="modal" data-bs-target="#call911Modal" className="btn btn-primary">
          Create 911 call
        </button>
      </div>

      <Create911Call />
      <ActiveMapCalls />
    </>
  );
}

const mapToProps = (state: State) => ({
  cadInfo: state.global.cadInfo,
  calls: state.calls.calls_911,
});

export default connect(mapToProps, { getActiveUnits })(Map);
