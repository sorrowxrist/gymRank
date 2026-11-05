// ============================================================
// 1) DATOS: umbrales en kg de cada rango por músculo.
//    umbrales = [bronce, plata, oro, diamante] (kg mínimos)
//    Son valores de ejemplo: cambialos a tu gusto.
// ============================================================
const RANGOS = ["bronce", "plata", "oro", "diamante"];

const MUSCULOS = {
  hombros:    { nombre: "Hombros",     umbrales: [0, 8, 14, 22] },
  pecho:      { nombre: "Pectorales",  umbrales: [0, 20, 35, 50] },
  abdomen:    { nombre: "Abdomen",     umbrales: [0, 20, 35, 50] },
  biceps:     { nombre: "Bíceps",      umbrales: [0, 10, 16, 23] },
  antebrazos: { nombre: "Antebrazos",  umbrales: [0, 15, 25, 35] },
  piernas:    { nombre: "Piernas",     umbrales: [0, 50, 90, 130] },
  gemelos:    { nombre: "Gemelos",     umbrales: [0, 40, 80, 120] },
};

const CLAVE_STORAGE = "gym-rank:marcas";

// ============================================================
// 2) ESTADO
// ============================================================
let marcas = cargarMarcas();
let musculoActual = null;

function cargarMarcas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || {};
  } catch {
    return {};
  }
}

function guardarMarcas() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(marcas));
}

// ============================================================
// 3) LÓGICA
// ============================================================
function calcularRango(kg, umbrales) {
  for (let i = umbrales.length - 1; i >= 0; i--) {
    if (kg >= umbrales[i]) return i;
  }
  return 0;
}

// ============================================================
// 4) DOM
// ============================================================
const formulario = document.getElementById("formulario");
const vacio = document.getElementById("vacio");
const titulo = document.getElementById("nombre-musculo");
const inputKg = document.getElementById("kg");
const resultado = document.getElementById("resultado");
const cuerpo = document.querySelector(".cuerpo");

function pintarCuerpo() {
  document.querySelectorAll(".musculo").forEach((forma) => {
    const clave = forma.dataset.musculo;
    if (marcas[clave]) {
      const i = calcularRango(marcas[clave], MUSCULOS[clave].umbrales);
      forma.dataset.rango = RANGOS[i];
    } else {
      delete forma.dataset.rango;
    }
  });
}

function mostrarResultado(clave) {
  const { umbrales } = MUSCULOS[clave];
  const kg = marcas[clave];
  if (!kg) { resultado.innerHTML = ""; return; }

  const i = calcularRango(kg, umbrales);
  const nombre = RANGOS[i].toUpperCase();
  let texto = `<strong class="${RANGOS[i]}">${nombre}</strong><br>${kg} kg.`;

  if (i < RANGOS.length - 1) {
    const falta = umbrales[i + 1] - kg;
    texto += ` Te faltan ${falta} kg para ${RANGOS[i + 1]}.`;
  } else {
    texto += " Llegaste al rango máximo.";
  }
  resultado.innerHTML = texto;
}

function seleccionar(clave) {
  musculoActual = clave;

  document.querySelectorAll(".musculo").forEach((forma) => {
    forma.classList.toggle("activo", forma.dataset.musculo === clave);
  });

  titulo.textContent = MUSCULOS[clave].nombre;
  inputKg.value = marcas[clave] ?? "";
  vacio.hidden = true;
  formulario.hidden = false;
  mostrarResultado(clave);
}

// ============================================================
// 5) EVENTOS
// ============================================================
cuerpo.addEventListener("click", (e) => {
  const forma = e.target.closest(".musculo");
  if (forma) seleccionar(forma.dataset.musculo);
});

cuerpo.addEventListener("keydown", (e) => {
  const forma = e.target.closest(".musculo");
  if (forma && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    seleccionar(forma.dataset.musculo);
  }
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const kg = parseFloat(inputKg.value);
  if (!musculoActual || !(kg > 0)) return;

  marcas[musculoActual] = kg;
  guardarMarcas();
  pintarCuerpo();
  mostrarResultado(musculoActual);
});

// ============================================================
// 6) INTRO VHS y RELOJ
// ============================================================
const intro = document.getElementById("intro");

function cerrarIntro() {
  if (!intro || intro.classList.contains("saliendo")) return;
  intro.classList.add("saliendo");              // dispara el fundido del CSS
  setTimeout(() => intro.remove(), 700);        // la sacamos del DOM al terminar
  document.removeEventListener("keydown", cerrarIntro);
}

intro.addEventListener("click", cerrarIntro);
document.addEventListener("keydown", cerrarIntro);
setTimeout(cerrarIntro, 7000);                  // se cierra sola a los 7 segundos

// Fecha y hora estilo cámara VHS, se actualiza cada segundo
function actualizarReloj() {
  const t = new Date().toLocaleString("es-AR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).toUpperCase();
  document.querySelectorAll(".reloj").forEach((el) => { el.textContent = t; });
}
actualizarReloj();
setInterval(actualizarReloj, 1000);

pintarCuerpo();
