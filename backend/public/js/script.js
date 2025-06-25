
const socket = io();

console.log("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

if(navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords;
    const { accuracy } = position.coords;
    console.log(accuracy)
    console.log(`Accuracy: ${accuracy} meters`);
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    socket.emit("send-location", { latitude, longitude });
  }, (error) => {
    console.error("Error getting location:", error);
  },
{
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 2000
});
} else {
  alert('Geolocation is not supported by your browser');
}

const map =L.map('map').setView([0, 0], 25);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const markers={};

socket.on("recieve-location", (data) => {
  const { id, latitude, longitude } = data;
  console.log(`Location updated for ${id}: Latitude: ${latitude}, Longitude: ${longitude}`);
  map.setView([latitude, longitude],20);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", () => {
//   const { id } = data;
console.log(socket.id);
const  id  = socket.id;
  console.log(`User disconnected: ${socket.id}`);
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});