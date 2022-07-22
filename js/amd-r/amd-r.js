// Getting AMD-R id
const id_no = window.location.pathname.split('/')[2];

// Setting up variables
const name = document.getElementById('name');
const battery = document.getElementById('battery');
const battery_bar = document.getElementById('battery-bar');
const speed = document.getElementById('speed');
const speed_bar = document.getElementById('speed-bar');
const task = document.getElementById('task');

// Setting up openstreet map
let coords = [2.947, 101.8752];
// Map
const map = L.map('map').setView(coords, 19);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
// Marker
const marker = L.marker(coords).addTo(map);
marker.on('move', (e) => {
  map.panTo(e.latlng);
});

async function getData(id) {
  const res = await fetch(`/api/amd-r/getData?id=${id}`);
  const data = await res.json();

  // Changing elements
  name.innerHTML = data.name;
  battery.innerHTML = data.battery + '%';
  battery_bar.style.width = data.battery + '%';
  speed.innerHTML = data.speed + ' m/s';
  speed_bar.style.width = data.speed / 2 * 100 + '%';
  task.innerHTML = data.mission;

  // Updating map
  // Setting up coords
  if (data.gps.lat != undefined && data.gps.lon != undefined) {
    coords = data.gps;
  }
  marker.setLatLng(coords);

  setTimeout(() => {
    getData(id);
  }, 1000);
}
getData(id_no, map);
