// Draws the map on the listing page (Leaflet + OpenStreetMap).
// The listing's position and text come from the data attributes of #map.
const mapElement = document.getElementById("map");

if (mapElement && window.L) {
  const lat = Number(mapElement.dataset.lat);
  const lng = Number(mapElement.dataset.lng);

  // our first map: centered on the listing, zoomed to city level
  const map = L.map(mapElement).setView([lat, lng], 11);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // popup content is built with textContent, so the text can never run as HTML
  const popup = document.createElement("div");

  const title = document.createElement("strong");
  title.textContent = mapElement.dataset.title;

  const place = document.createElement("div");
  place.textContent = mapElement.dataset.place;

  const note = document.createElement("small");
  note.className = "text-muted";
  note.textContent = "Exact location is shared after booking";

  popup.append(title, place, note);

  // marker on the listing, with a popup that opens right away
  L.marker([lat, lng]).addTo(map).bindPopup(popup).openPopup();
}