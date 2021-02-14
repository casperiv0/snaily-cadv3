import * as React from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "../../styles/map.css";
import Logger from "../../lib/Logger";
import CADSocket from "../../lib/socket";
import {
  Player,
  DataActions,
  MarkerPayload,
  CustomMarker,
  LatLng,
  defaultTypes,
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
import { update911Call } from "../../lib/actions/911-calls";
import { CallInfoHTML, PlayerInfoHTML } from "../../components/dispatch/map/html";
import User from "../../interfaces/User";
import { getMembers } from "../../lib/actions/admin";

/* MOST CODE IN THIS FILE IS FROM TGRHavoc/live_map-interface, SPECIAL THANKS TO HIM FOR MAKING THIS! */
/* STATUS: NOT COMPLETE */

/* 
 ? Search for:
 * REMOVE_CALL_FROM_MAP
 * CREATE_CALL_MARKER
 * UPDATE_CALL_POSITION
 * REMOVE_911_CALL_FROM_MAP
*/

const TILES_URL = "/tiles/minimap_sea_{y}_{x}.png";

interface Props {
  cadInfo: CadInfo;
  calls: Call[];
  user: User;
  getActiveUnits: () => void;
  getMembers: () => void;
  update911Call: (id: string, data: Partial<Call>) => void;
  members: User[];
}

function Map({ getActiveUnits, update911Call, getMembers, cadInfo, calls, members }: Props) {
  const [MarkerStore, setMarkerStore] = React.useState<CustomMarker[]>([]);
  const [map, setMap] = React.useState<L.Map | null>(null);
  const [PlayerMarkers] = React.useState<L.Layer>(createCluster());
  const [MarkerTypes] = React.useState<any>(defaultTypes);
  const [ran, setRan] = React.useState(false);

  const socket = React.useMemo(() => {
    if (!cadInfo.live_map_url) return;
    return new WebSocket(`${cadInfo.live_map_url}`);
  }, [cadInfo]);

  React.useEffect(() => {
    getActiveUnits();
    getMembers();
  }, [getActiveUnits, getMembers]);

  React.useEffect(() => {
    return () => {
      if (process.env.REACT_APP_IS_DEV !== "true") {
        socket?.close();
        setMarkerStore([]);
        setMap(null);
        setRan(false);
      }
    };
  }, [socket]);

  const createMarker = React.useCallback(
    (draggable: boolean, payload: MarkerPayload, title: string): CustomMarker | undefined => {
      if (map === null) return;
      let newPos: LatLng;

      if ("lat" in payload.pos) {
        newPos = {
          lat: payload.pos.lat,
          lng: payload.pos.lng,
        };
      } else {
        const coords = stringCoordToFloat(payload.pos);
        const converted = convertToMap(coords.x, coords.y, map);
        if (!converted) return;

        newPos = converted;
      }

      const converted = newPos;
      const infoContent =
        (payload.player && PlayerInfoHTML(payload.player)) ||
        (payload.call && CallInfoHTML(payload.call)) ||
        "<p>Hello world</p>";
      const where = payload.player ? PlayerMarkers : map;

      const marker: CustomMarker = (L as any)
        .marker(converted, {
          title,
          draggable,
        })
        .addTo(where)
        .bindPopup(infoContent);

      if (payload.icon !== null) {
        const img = L.icon(payload.icon);
        marker.setIcon(img);
      }

      marker.payload = payload;

      setMarkerStore((prev) => {
        return [...prev, marker];
      });

      return marker;
    },
    [PlayerMarkers, map],
  );

  const onMessage = React.useCallback(
    (e) => {
      const data = JSON.parse(e.data) as DataActions;

      switch (data.type) {
        case "playerLeft": {
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

            const member = members.find((m) => `steam:${m.steam_id}` === player.identifier);
            if (!member) return;
            if (member.leo === "0" || member.ems_fd === "0") return;

            if (marker) {
              const coords = stringCoordToFloat(player.pos);
              const converted = convertToMap(coords.x, coords.y, map!);
              if (!converted) return;
              marker.setLatLng(converted);
            } else {
              createMarker(
                false,
                {
                  icon: MarkerTypes?.["6"],
                  description: "Hello world",
                  pos: player.pos,
                  title: player.name,
                  isPlayer: true,
                  player: {
                    ...player,
                    ems_fd: member.ems_fd === "1",
                    leo: member.leo === "1",
                  },
                  id: MarkerStore.length,
                },
                player?.name,
              );
            }
          });
          break;
        }
        default: {
          return;
        }
      }
    },
    [MarkerStore, createMarker, map, MarkerTypes, members],
  );

  const remove911Call = React.useCallback(
    (id: string) => {
      setMarkerStore((prev) => {
        const marker = prev.find((m) => m.payload.call?.id === id);
        marker?.remove();
        marker?.removeFrom(map!);
        return prev.filter((marker) => {
          if (marker.payload.call) {
            return marker.payload.call.id !== id;
          } else {
            return true;
          }
        });
      });
    },
    [map],
  );

  const handleCalls = React.useCallback(async () => {
    if (!map) return;
    await new Promise((resolve) => setTimeout(resolve, 500));

    calls.forEach((call) => {
      //? REMOVE_CALL_FROM_MAP
      const m = MarkerStore.some((marker) => marker.payload?.call?.id === call.id);

      if (m) return;
      if (call.hidden === "1") return;

      //? CREATE_CALL_MARKER
      const marker = createMarker(
        true,
        {
          icon: null,
          description: `911 Call from: ${call.name}`,
          id: MarkerStore.length,
          pos: call.pos,
          isPlayer: false,
          title: "911 Call",
          call,
        },
        call.location,
      );
      if (!marker) return;

      //? UPDATE_CALL_POSITION
      marker.on("moveend", async (e) => {
        const target = e.target;
        const latLng: LatLng = (target as any)._latlng;

        update911Call(call.id, {
          ...call,
          pos: latLng,
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calls]);

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
  }, [map, onMessage, socket]);

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
    handleCalls();
  }, [handleCalls]);

  React.useEffect(() => {
    //? REMOVE_911_CALL_FROM_MAP
    CADSocket.on("END_911_CALL", (callId: string) => {
      remove911Call(callId);
    });
  }, [map, calls, remove911Call]);

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
      <ActiveMapCalls
        hasMarker={(callId: string) => {
          return MarkerStore.some((m) => m.payload?.call?.id === callId);
        }}
        setMarker={(call: Call, type: "remove" | "place") => {
          const marker = MarkerStore.some((m) => m.payload.call?.id === call.id);
          if (marker && type === "place") return;

          if (marker && type === "remove") {
            remove911Call(call.id);
          }

          update911Call(call.id, {
            ...call,
            hidden: type === "remove" ? "1" : "0",
          });
        }}
      />
    </>
  );
}

const mapToProps = (state: State) => ({
  cadInfo: state.global.cadInfo,
  calls: state.calls.calls_911,
  user: state.auth.user,
  members: state.admin.members,
});

export default connect(mapToProps, { getActiveUnits, update911Call, getMembers })(Map);
