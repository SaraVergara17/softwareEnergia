function login() {
  const user = document.getElementById('user').value;
  const pass = document.getElementById('pass').value;

  if (user && pass) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    generarValoresEnergia();
  } else {
    alert('Por favor ingresa usuario y contraseña');
  }
}

function generarValoresEnergia() {
  const consumo = (Math.random() * (500 - 50) + 50).toFixed(2);
  document.getElementById('energy-value').innerText = consumo + ' kWh';
}

function descargarInforme() {
  const fecha = new Date().toLocaleString();
  const consumo = document.getElementById('energy-value').innerText;

  const contenido = `INFORME DE ENERGÍA\n\nFecha: ${fecha}\nConsumo estimado: ${consumo}\n\nModelo ML: Simulación prototipo`;

  const blob = new Blob([contenido], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'informe_energia.txt';
  a.click();
  URL.revokeObjectURL(url);
}
