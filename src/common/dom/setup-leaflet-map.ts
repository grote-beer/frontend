import type { Map, TileLayer } from "leaflet";

// Sets up a Leaflet map on the provided DOM element
export type LeafletModuleType = typeof import("leaflet");
export type LeafletDrawModuleType = typeof import("leaflet-draw");

export const setupLeafletMap = async (
  mapElement: HTMLElement,
  darkMode?: boolean
): Promise<[Map, LeafletModuleType, TileLayer]> => {
  if (!mapElement.parentNode) {
    throw new Error("Cannot setup Leaflet map on disconnected element");
  }
  // eslint-disable-next-line
  const Leaflet = ((await import("leaflet")) as any)
    .default as LeafletModuleType;
  Leaflet.Icon.Default.imagePath = "/static/images/leaflet/images/";

  const map = Leaflet.map(mapElement);
  const style = document.createElement("link");
  style.setAttribute("href", "/static/images/leaflet/leaflet.css");
  style.setAttribute("rel", "stylesheet");
  mapElement.parentNode.appendChild(style);
  map.setView([52.3731339, 4.8903147], 13);

  const tileLayer = createTileLayer(Leaflet, Boolean(darkMode)).addTo(map);

  return [map, Leaflet, tileLayer];
};

export const replaceTileLayer = (
  leaflet: LeafletModuleType,
  map: Map,
  tileLayer: TileLayer,
  darkMode: boolean
): TileLayer => {
  map.removeLayer(tileLayer);
  tileLayer = createTileLayer(leaflet, darkMode);
  tileLayer.addTo(map);
  return tileLayer;
};
// `https://{s}.basemaps.cartocdn.com/${
//      darkMode ? "dark_all" : "light_all"
//    }/{z}/{x}/{y}${leaflet.Browser.retina ? "@2x.png" : ".png"}`,
const createTileLayer = (
  leaflet: LeafletModuleType,
  darkMode: boolean
): TileLayer =>
  leaflet.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
    attribution: "Beer inc" + darkMode ? "" : "",
  });
