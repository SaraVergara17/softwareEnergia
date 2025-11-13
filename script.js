function login() {
  if (user.value && pass.value) {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    generarDatos();
  }
}

function generarDatos() {
  const consumo = +(Math.random() * (500 - 50) + 50).toFixed(2);
  const costo = (consumo * 0.15).toFixed(2);
  const co2 = (consumo * 0.233).toFixed(2);

  document.getElementById("energy-value").innerText = consumo + " kWh";
  document.getElementById("costo").innerText = "Costo estimado: $" + costo;
  document.getElementById("co2").innerText = "CO₂ estimado: " + co2 + " kg";

  evaluarConsumo(consumo);
  guardarHistorial(consumo, costo);
  mostrarHistorial();
  generarGraficos();
  prediccion(consumo);
  recomendacion(consumo);
  clasificacion();
}

function evaluarConsumo(c) {
  const estado = document.getElementById("estado-consumo");
  if (c < 150) estado.innerText = "Consumo Bajo 🟢";
  else if (c < 300) estado.innerText = "Consumo Medio 🟡";
  else estado.innerText = "Consumo Alto 🔴";
}

function guardarHistorial(kwh, cost) {
  let data = JSON.parse(localStorage.getItem("historial")) || [];
  data.push({ fecha: new Date().toLocaleDateString(), kwh, cost });
  localStorage.setItem("historial", JSON.stringify(data));
}

function mostrarHistorial() {
  const tabla = document.querySelector("#tabla-historial tbody");
  tabla.innerHTML = "";
  let datos = JSON.parse(localStorage.getItem("historial")) || [];
  datos.forEach(d => {
    tabla.innerHTML += `<tr>
      <td>${d.fecha}</td>
      <td>${d.kwh}</td>
      <td>$${d.cost}</td>
    </tr>`;
  });
}

function generarGraficos() {
  let datos = JSON.parse(localStorage.getItem("historial")) || [];
  const valores = datos.map(d => d.kwh);
  const labels = datos.map(d => d.fecha);

  new Chart(document.getElementById("grafica"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Consumo (kWh)",
        data: valores,
        borderWidth: 2
      }]
    }
  });
}

function prediccion(actual) {
  const p = actual + (Math.random() * 20 - 10);
  document.getElementById("prediccion").innerText =
    "Predicción para mañana: " + p.toFixed(2) + " kWh";
}

function recomendacion(c) {
  let msg = "";
  if (c < 150) msg = "Buen trabajo, tu consumo es eficiente.";
  else if (c < 300) msg = "Revisa uso de electrodomésticos.";
  else msg = "Tu consumo es muy alto, considera apagar equipos.";

  document.getElementById("recomendacion").innerText = msg;
}

function clasificacion() {
  const categorias = [
    { nombre: "Iluminación", valor: 30 },
    { nombre: "Refrigeración", valor: 25 },
    { nombre: "Cocina", valor: 20 },
    { nombre: "Electrónica", valor: 15 },
    { nombre: "Otros", valor: 10 },
  ];

  document.getElementById("clasificacion").innerHTML =
    categorias.map(c => `<li>${c.nombre}: ${c.valor}%</li>`).join("");
}

function toggleModo() {
  document.body.classList.toggle("dark");
}

function descargarInforme() {
  const contenido = "Informe Energético\nGenerado: " + new Date();
  const blob = new Blob([contenido], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "informe.txt";
  a.click();
}
