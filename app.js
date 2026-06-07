const API_URL =
"https://script.google.com/macros/s/AKfycbwZb_nGksYQnydXGpRIvgZnHUH566M6hMNDNLRH23_LJFQ8MQu9iAnlDi1orbvthvPcew/exec";

let radios = [];

/****************************************
 * CARGAR RADIOS
 ****************************************/
async function loadRadios() {

  try {

    const response =
      await fetch(API_URL);

    const data =
      await response.json();

    console.log(
      "Datos recibidos:",
      data
    );

    radios =
      data.radios || [];

    renderCards();

  } catch (error) {

    console.error(
      "Error cargando radios:",
      error
    );

  }

}

/****************************************
 * RENDERIZAR
 ****************************************/
function renderCards() {

  const pendientesContainer =
    document.getElementById(
      "pendientesContainer"
    );

  const aprobadasContainer =
    document.getElementById(
      "aprobadasContainer"
    );

  if (
    !pendientesContainer ||
    !aprobadasContainer
  ) {
    return;
  }

  pendientesContainer.innerHTML = "";
  aprobadasContainer.innerHTML = "";

  const pendientes =
    radios.filter(
      r =>
        !String(
          r.pageId || ""
        ).trim()
    );

  const aprobadas =
    radios.filter(
      r =>
        String(
          r.pageId || ""
        ).trim()
    );

  document
    .getElementById(
      "total"
    )
    .textContent =
    radios.length;

  document
    .getElementById(
      "pendientes"
    )
    .textContent =
    pendientes.length;

  document
    .getElementById(
      "publicadas"
    )
    .textContent =
    aprobadas.length;

  pendientes.forEach(
    radio => {

      pendientesContainer.appendChild(
        crearCard(
          radio,
          false
        )
      );

    }
  );

  aprobadas.forEach(
    radio => {

      aprobadasContainer.appendChild(
        crearCard(
          radio,
          true
        )
      );

    }
  );

}
/****************************************
 * CREAR TARJETA
 ****************************************/
function crearCard(
  radio,
  publicada
) {

  const card =
    document.createElement(
      "div"
    );

  card.className =
    "card";

  let botones = "";

  if (!publicada) {

    botones = `

      <button
      class="btn approve"
      onclick="aprobar(${radio.fila})">

        ✅ Aprobar

      </button>

      <button
      class="btn delete"
      onclick="eliminarRadio(${radio.fila})">

        🗑 Eliminar

      </button>

    `;

  } else {

    botones = `

      <a
      href="${radio.url || '#'}"
      target="_blank"
      class="btn view">

        🔗 Ver Blog

      </a>

      <button
      class="btn edit"
      onclick="editar(${radio.fila})">

        ✏️ Editar

      </button>

    `;

  }

  card.innerHTML = `

    <img
    src="${radio.logo || 'https://via.placeholder.com/500x300?text=Radio'}"
    alt="${radio.nombre}"
    onerror="this.src='https://via.placeholder.com/500x300?text=Radio'">

    <div class="content">

      <h3>
        ${radio.nombre || "Sin nombre"}
      </h3>

      <p>
        📍 ${radio.ciudad || ""}
        ${radio.pais ? ", " + radio.pais : ""}
      </p>

      <audio
      controls
      class="player">

        <source
        src="${radio.stream || ''}">

      </audio>

      <div class="actions">

        ${botones}

      </div>

    </div>

  `;

  return card;

}

/****************************************
 * APROBAR
 ****************************************/
/****************************************
 * APROBAR
 ****************************************/

async function aprobar(fila){

  const confirmar = confirm(
    "✅ ¿Deseas aprobar y publicar esta emisora?\n\nSe creará automáticamente la entrada en Blogger."
  );

  if(!confirmar){
    return;
  }

  try{

    await fetch(
      API_URL,
      {
        method:"POST",
        body:JSON.stringify({

          action:"aprobar",

          fila

        })
      }
    );

    alert(
      "🎉 Emisora publicada correctamente"
    );

    loadRadios();

  }catch(error){

    console.error(error);

    alert(
      "❌ Error al publicar la emisora"
    );

  }

}
/****************************************
 * ELIMINAR
 ****************************************/
async function eliminarRadio(fila){

  const confirmar = confirm(
    "⚠️ ¿Seguro que deseas eliminar esta emisora?\n\nEsta acción no se puede deshacer."
  );

  if(!confirmar){
    return;
  }

  try{

    await fetch(
      API_URL,
      {
        method:"POST",
        body:JSON.stringify({
          action:"eliminar",
          fila
        })
      }
    );

    alert("✅ Emisora eliminada correctamente");

    loadRadios();

  }catch(error){

    alert("❌ Error al eliminar");

    console.error(error);

  }

}

/****************************************
 * EDITAR
 ****************************************/
function editar(fila){

const radio =
radios.find(
r => r.fila == fila
);

if(!radio) return;

document
.getElementById(
"editFila"
).value = fila;

document
.getElementById(
"editNombre"
).value =
radio.nombre || "";

document
.getElementById(
"editCiudad"
).value =
radio.ciudad || "";

document
.getElementById(
"editPais"
).value =
radio.pais || "";

document
.getElementById(
"editStream"
).value =
radio.stream || "";

document
.getElementById(
"editLogo"
).value =
radio.logo || "";

document
.getElementById(
"editWeb"
).value =
radio.web || "";

document
.getElementById(
"editWhatsapp"
).value =
radio.whatsapp || "";

document
.getElementById(
"editFacebook"
).value =
radio.facebook || "";

document
.getElementById(
"editInstagram"
).value =
radio.instagram || "";

document
.getElementById(
"editDescripcion"
).value =
radio.descripcion || "";

document
.getElementById(
"editModal"
).style.display =
"flex";

}
function cerrarModal(){

document
.getElementById(
"editModal"
).style.display =
"none";

}

/****************************************
 * BUSCADOR
 ****************************************/
document.addEventListener(
  "DOMContentLoaded",
  () => {

    const searchInput =
      document.getElementById(
        "search"
      );

    if (searchInput) {

      searchInput.addEventListener(
        "input",
        function () {

          const texto =
            this.value
            .toLowerCase();

          document
            .querySelectorAll(
              ".card"
            )
            .forEach(card => {

              card.style.display =
                card.innerText
                  .toLowerCase()
                  .includes(texto)
                  ? ""
                  : "none";

            });

        }
      );

    }

    loadRadios();

  }
);
function showTab(
  tab,
  btn
){

  document
  .querySelectorAll(
    ".tab-content"
  )
  .forEach(el => {

    el.classList.remove(
      "active"
    );

  });

  document
  .querySelectorAll(
    ".nav-btn"
  )
  .forEach(el => {

    el.classList.remove(
      "active"
    );

  });

  const tabs = {

    pendientes:
    "tabPendientes",

    aprobadas:
    "tabAprobadas",

    config:
    "tabConfig"

  };

  const destino =
  document.getElementById(
    tabs[tab]
  );

  if(destino){

    destino.classList.add(
      "active"
    );

  }

  if(btn){

    btn.classList.add(
      "active"
    );

  }

}
/****************************************
 * INICIAR TAB POR DEFECTO
 ****************************************/
document.addEventListener(
  "DOMContentLoaded",
  () => {

    const primeraTab =
      document.getElementById(
        "tabPendientes"
      );

    if(primeraTab){

      primeraTab.classList.add(
        "active"
      );

    }

    const primerBoton =
      document.querySelector(
        ".nav-btn"
      );

    if(primerBoton){

      primerBoton.classList.add(
        "active"
      );

    }

  }
);
function actualizarDatos(){

  loadRadios();

  alert(
    "Datos actualizados correctamente."
  );

}
function toggleTema(){

  document.body.classList.toggle(
    "light-theme"
  );

}
function cerrarSesion(){

  localStorage.removeItem(
    "adminLogged"
  );

  window.location.href =
  "login.html";

}
let filaEliminar = null;

function eliminarRadio(fila){

  filaEliminar = fila;

  document
  .getElementById("deleteModal")
  .style.display = "flex";

}

function cerrarDeleteModal(){

  document
  .getElementById("deleteModal")
  .style.display = "none";

}

async function confirmarEliminar(){

  try{

    await fetch(
      API_URL,
      {
        method:"POST",
        body:JSON.stringify({
          action:"eliminar",
          fila:filaEliminar
        })
      }
    );

    cerrarDeleteModal();

    loadRadios();

  }catch(error){

    console.error(error);

  }

}
let filaAprobar = null;

function aprobar(fila){

  filaAprobar = fila;

  document
  .getElementById("approveModal")
  .style.display = "flex";

}

function cerrarApproveModal(){

  document
  .getElementById("approveModal")
  .style.display = "none";

}

async function confirmarAprobacion(){

  try{

    await fetch(
      API_URL,
      {
        method:"POST",
        body:JSON.stringify({

          action:"aprobar",

          fila:filaAprobar

        })
      }
    );

    cerrarApproveModal();

    loadRadios();

  }catch(error){

    console.error(error);

  }

}
