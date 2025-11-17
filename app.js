// MAP
var map = L.map('map').setView([49.553517, 25.594767], 13); // Тернопіль

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(map);

let startMarker, endMarker, routeLine;

// Price settings
const pricePerKm = 15;

// ROUTE
document.getElementById("routeBtn").onclick = () => {
  const start = document.getElementById("startInput").value;
  const end = document.getElementById("endInput").value;

  if (!start || !end) return alert("Заповніть поля!");

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${start}`)
    .then(r => r.json())
    .then(startData => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${end}`)
        .then(r => r.json())
        .then(endData => {

          const s = [startData[0].lat, startData[0].lon];
          const e = [endData[0].lat, endData[0].lon];

          if (startMarker) startMarker.remove();
          if (endMarker) endMarker.remove();
          if (routeLine) routeLine.remove();

          startMarker = L.marker(s).addTo(map);
          endMarker = L.marker(e).addTo(map);

          routeLine = L.polyline([s, e], { color: "yellow" }).addTo(map);

          const distKm = map.distance(s, e) / 1000;
          const price = Math.round(distKm * pricePerKm);

          document.getElementById("dist").textContent = distKm.toFixed(1) + " км";
          document.getElementById("price").textContent = price + " грн";

        });
    });
};


// FIREBASE CHAT
const firebaseConfig = {
  apiKey: "demo",
  authDomain: "demo",
  projectId: "demo"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById("sendMsg").onclick = () => {
  const msg = document.getElementById("msgInput").value;
  if (!msg) return;

  db.collection("messages").add({
    text: msg,
    time: Date.now()
  });

  document.getElementById("msgInput").value = "";
};

db.collection("messages")
  .orderBy("time")
  .onSnapshot(snap => {
    const box = document.getElementById("messages");
    box.innerHTML = "";
    snap.forEach(doc => {
      box.innerHTML += `<div>${doc.data().text}</div>`;
    });
  });


// ORDER BUTTON (dummy)
document.getElementById("orderBtn").onclick = () => {
  alert("Замовлення прийнято! Водій вже прямує 🚖");
};
