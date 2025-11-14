// ===== VARIABLES GLOBALES =====
let grafica = null;

// ===== LOGIN =====
function login() {
  const userVal = document.getElementById('user').value.trim();
  const passVal = document.getElementById('pass').value.trim();

  if (userVal && passVal) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';

    // Mensaje de bienvenida personalizado
    const bienvenida = document.getElementById('mensaje-bienvenida');
    bienvenida.innerText = `¡Bienvenido, ${userVal}! Gracias por usar tu asistente de energía.`;

    iniciarPanelEnergia();
  } else {
    alert('Por favor ingresa usuario y contraseña');
  }
}


// ===== INICIO DEL PANEL =====
function iniciarPanelEnergia() {
  registrarNuevoConsumo();
  mostrarHistorial();
  actualizarGrafica();
  mostrarSugerenciaSimple();
}

// Genera un número de consumo aleatorio coherente
function generarConsumo() {
  return parseFloat((Math.random() * (500 - 50) + 50).toFixed(2));
}

// Obtiene historial desde localStorage
function obtenerHistorial() {
  const data = localStorage.getItem('historialEnergia');
  return data ? JSON.parse(data) : [];
}

// Guarda historial en localStorage
function guardarHistorial(historial) {
  localStorage.setItem('historialEnergia', JSON.stringify(historial));
}

// Registra una nueva medición de consumo
function registrarNuevoConsumo() {
  const consumo = generarConsumo();
  const fecha = new Date();
  const fechaTexto = fecha.toLocaleString();
  const costo = parseFloat((consumo * 0.15).toFixed(2));
  const co2 = parseFloat((consumo * 0.233).toFixed(2));

  let historial = obtenerHistorial();
  const anterior = historial.length > 0 ? historial[historial.length - 1] : null;

  const registro = {
    fecha: fechaTexto,
    consumo,
    costo,
    co2
  };

  historial.push(registro);
  guardarHistorial(historial);

  // Actualizar datos en pantalla
  document.getElementById('energy-value').innerText = consumo + ' kWh';
  document.getElementById('costo').innerText = 'Costo estimado: $' + costo;
  document.getElementById('co2').innerText = 'Huella de CO₂: ' + co2 + ' kg';

  actualizarEstadoConsumo(consumo);
  actualizarComparacion(consumo, anterior);
  actualizarPrediccion(consumo);
  actualizarRecomendacion(consumo);
  actualizarClasificacionConsumo();

  // Actualizar historial y gráfica al generar una nueva medición
  mostrarHistorial();
  actualizarGrafica();
}

// Estado del consumo (semáforo)
function actualizarEstadoConsumo(consumo) {
  const estadoEl = document.getElementById('estado-consumo');
  let texto = '';

  if (consumo < 150) {
    texto = 'Consumo bajo 🟢';
  } else if (consumo < 300) {
    texto = 'Consumo medio 🟡';
  } else {
    texto = 'Consumo alto 🔴';
  }

  estadoEl.innerText = texto;
}

// Comparación con el consumo anterior
function actualizarComparacion(actual, anterior) {
  const compEl = document.getElementById('comparacion');

  if (!anterior) {
    compEl.innerText = 'Este es tu primer registro de consumo.';
    return;
  }

  const diff = (actual - anterior.consumo).toFixed(2);
  const porcentaje = ((diff / anterior.consumo) * 100).toFixed(1);

  if (diff > 0) {
    compEl.innerText = `Has consumido ${diff} kWh más que la medición anterior (+${porcentaje}%).`;
  } else if (diff < 0) {
    compEl.innerText = `Has consumido ${Math.abs(diff)} kWh menos que la medición anterior (${porcentaje}%). ¡Buen trabajo!`;
  } else {
    compEl.innerText = 'Tu consumo es igual al registro anterior.';
  }
}

// Predicción simple de consumo
function actualizarPrediccion(actual) {
  const variacion = Math.random() * 20 - 10; // entre -10 y +10
  const pred = (actual + variacion).toFixed(2);
  document.getElementById('prediccion').innerText = 'Predicción estimada para la próxima medición: ' + pred + ' kWh';
}

// Recomendación basada en consumo
function actualizarRecomendacion(consumo) {
  const recEl = document.getElementById('recomendacion');
  let msg = '';

  if (consumo < 150) {
    msg = 'Tu consumo es eficiente. Continúa utilizando solo lo necesario y aprovecha la luz natural.';
  } else if (consumo < 300) {
    msg = 'Revisa el uso de electrodomésticos como nevera, lavadora y equipos de entretenimiento para reducir picos.';
  } else {
    msg = 'Tu consumo es alto. Considera apagar dispositivos en espera, revisar el aire acondicionado y usar bombillos LED.';
  }

  recEl.innerText = msg;
}

// Sugerencia rápida de ahorro
function mostrarSugerenciaSimple() {
  const sugerencias = [
    'Apaga las luces al salir de una habitación.',
    'Desconecta cargadores y regletas cuando no los uses.',
    'Aprovecha la iluminación natural durante el día.',
    'Usa electrodomésticos en horarios de menor demanda si tu tarifa lo permite.',
    'Mantén la nevera bien cerrada y a una temperatura adecuada.',
    'Lava la ropa con agua fría siempre que sea posible.',
    'Evita dejar el televisor y el computador en modo reposo por muchas horas.'
  ];

  const indice = Math.floor(Math.random() * sugerencias.length);
  document.getElementById('sugerencia-simple').innerText = sugerencias[indice];
}

// Clasificación del consumo por categorías (simulada)
function actualizarClasificacionConsumo() {
  const categorias = [
    { nombre: 'Iluminación', valor: 30 },
    { nombre: 'Refrigeración', valor: 25 },
    { nombre: 'Cocina', valor: 20 },
    { nombre: 'Electrónica', valor: 15 },
    { nombre: 'Otros', valor: 10 }
  ];

  const lista = document.getElementById('clasificacion');
  lista.innerHTML = '';

  categorias.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = `${cat.nombre}: ${cat.valor}% (estimado)`;
    lista.appendChild(li);
  });
}

// Mostrar historial en la tabla
function mostrarHistorial() {
  const tbody = document.querySelector('#tabla-historial tbody');
  tbody.innerHTML = '';

  const historial = obtenerHistorial();
  historial.forEach(reg => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${reg.fecha}</td>
      <td>${reg.consumo} kWh</td>
      <td>$${reg.costo}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Actualizar gráfica de consumo
function actualizarGrafica() {
  const ctx = document.getElementById('grafica');
  const historial = obtenerHistorial();

  const labels = historial.map(r => r.fecha);
  const datos = historial.map(r => r.consumo);

  if (grafica) {
    grafica.destroy();
  }

  if (labels.length === 0) return;

  grafica = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Consumo (kWh)',
        data: datos,
        borderWidth: 2,
        tension: 0.2
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

// Modo claro / oscuro
function toggleModo() {
  document.body.classList.toggle('light');
}

// Descargar informe de energía
function descargarInforme() {
  const historial = obtenerHistorial();
  if (historial.length === 0) {
    alert('Aún no hay datos para generar el informe.');
    return;
  }

  const ultimo = historial[historial.length - 1];
  const promedio = (
    historial.reduce((acc, r) => acc + r.consumo, 0) / historial.length
  ).toFixed(2);

  let contenido = 'INFORME DE ENERGÍA (Prototipo IA)';

  contenido += `Última medición: ${ultimo.fecha}
`;
  contenido += `Consumo: ${ultimo.consumo} kWh
`;
  contenido += `Costo estimado: $${ultimo.costo}
`;
  contenido += `Huella de CO₂ estimada: ${ultimo.co2} kg

`;
  contenido += `Consumo promedio registrado: ${promedio} kWh
`;
  contenido += `Total de mediciones registradas: ${historial.length}

`;
  contenido += 'Este informe ha sido generado por un prototipo de asistente de energía basado en IA (simulado).';

  const blob = new Blob([contenido], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'informe_energia.txt';
  a.click();
  URL.revokeObjectURL(url);
}
