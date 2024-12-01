<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="center-title">AyussitoMusic</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">AyussitoMusic</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-tabs>
        <ion-tab tab="home">
          <ion-card> 
            <ion-card-header>
              <ion-card-title>Lista</ion-card-title>
              <ion-card-subtitle>Pide a tu artista favorito!</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <!-- Mostrar lista de artistas o mensaje si no hay resultados -->
              <div class="scrollable-list">
                <ion-list v-if="datosFiltrados.length > 0">
                  <ion-item v-for="artista in datosFiltrados" :key="artista.artista">
                    <ion-thumbnail slot="start">
                      <img alt="Foto" :src="artista.foto" />
                    </ion-thumbnail>
                    <ion-label>{{ artista.artista }}</ion-label>
                    <ion-button @click="mostrarCanciones(artista)">Ver canciones</ion-button>
                  </ion-item>
                </ion-list>
                <p v-else class="no-results-message">El cantante no está disponible</p> <!-- Mensaje cuando no hay artistas -->
              </div>
              <ion-searchbar placeholder="Buscar artista..." @ionInput="buscarArtista"></ion-searchbar>
            </ion-card-content>
          </ion-card>

          <!-- Modal de canciones -->
          <div v-if="mostrarModalCanciones" class="custom-modal">
            <div class="modal-content">
              <ion-header>
                <ion-toolbar>
                  <ion-title>Canciones de {{ artistaSeleccionado?.artista }}</ion-title>
                  <ion-buttons slot="end">
                    <ion-button @click="cerrarModal">Cerrar</ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              
              <ion-searchbar placeholder="Buscar canción..." @ionInput="buscarCancion"></ion-searchbar>

              <!-- Lista de canciones con scroll y mensaje si no hay resultados -->
              <div class="scrollable-songs">
                <ion-list v-if="cancionesFiltradas.length > 0">
                  <ion-item v-for="(cancion, index) in cancionesFiltradas" :key="index">
                    <ion-label>{{ cancion.nombreC }}</ion-label>
                    <!-- <ion-button @click="togglePreescucha(cancion)">
                      <ion-icon :icon="preescuchaActiva === cancion ? icons.pause : icons.play"></ion-icon>
                    </ion-button> -->

                    <!-- <ion-range v-if="preescuchaActiva === cancion" min:0 max:1 step:0.1 @ionChange="ajustarVolumen"></ion-range>
                     -->
                    <ion-button @click="enviarCancion(cancion.nombreC)">Enviar</ion-button>
                  </ion-item>
                </ion-list>
                <p v-else class="no-results-message">No está disponible</p> <!-- Mensaje cuando no hay resultados -->
              </div>
            </div>
          </div>
        </ion-tab>

        <ion-tab tab="todas">
          <!-- <p>Ejemplo</p> -->
           <div class="scrollable-songs">

            <ion-list v-if="todasCanciones.length > 0">
                  <ion-item v-for="(cancion, index) in todasCanciones" :key="index">
                    <ion-label>{{ cancion.nombreC }}</ion-label>
                    <!-- <ion-button @click="togglePreescucha(cancion)">
                      <ion-icon :icon="preescuchaActiva === cancion ? icons.pause : icons.play"></ion-icon>
                    </ion-button> -->

                    <!-- <ion-range v-if="preescuchaActiva === cancion" min:0 max:1 step:0.1 @ionChange="ajustarVolumen"></ion-range>
                     -->
                    <ion-button @click="enviarCancion(cancion.nombreC)">Enviar</ion-button>
                  </ion-item>
                </ion-list>
                <p v-else class="no-results-message">No está disponible</p> <!-- Mensaje cuando no hay resultados -->

           </div>
        </ion-tab>

        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="home">
            <ion-icon :icon="icons.peopleOutline" />
            Artistas
          </ion-tab-button>
          <ion-tab-button tab="todas">
            <ion-icon :icon="icons.musicalNotesOutline" />
            Todas las canciones
          </ion-tab-button>
          <ion-tab-button tab="library">
            <ion-icon :icon="icons.library" />
            Biblioteca
          </ion-tab-button>
          <ion-tab-button tab="search">
            <ion-icon :icon="icons.search" />
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTabs, IonTab, IonTabBar, IonTabButton, IonIcon, IonButton, IonRange } from '@ionic/vue';
import { playCircle, pauseCircle, radio, library, search, peopleOutline, musicalNotesOutline } from 'ionicons/icons';

const icons = {
  play: playCircle,
  pause: pauseCircle,
  radio,
  library,
  search,
  peopleOutline,
  musicalNotesOutline,
};

const datos = ref([]);
const datosFiltrados = ref([]);
const canciones = ref([]);
const cancionesFiltradas = ref([]);
const todasCanciones = ref([]);

const mostrarModalCanciones = ref(false);
const artistaSeleccionado = ref(null);
const preescuchaActiva = ref(null);
let audio = new Audio();




import data from "../../public/data/artistas.json";
 
    datos.value = data.artistas;
    datosFiltrados.value = [...data.artistas];
    
    datos.value.forEach(artista => {
      artista.canciones.forEach(cancion => {
        todasCanciones.value.push(cancion);
      });
    });
  

// Función para filtrar artistas en la búsqueda
const buscarArtista = (event) => {
  const query = event.target.value.toLowerCase();
  datosFiltrados.value = datos.value.filter(artista =>
    artista.artista.toLowerCase().includes(query)
  );
};

// Función para mostrar canciones de un artista
const mostrarCanciones = (artista) => {
  artistaSeleccionado.value = artista;
  canciones.value = artista.canciones;
  cancionesFiltradas.value = [...canciones.value];
  mostrarModalCanciones.value = true;
};

// Cerrar modal de canciones
const cerrarModal = () => {
  mostrarModalCanciones.value = false;
  detenerPreescucha();
};

// Función para preescuchar una canción
const togglePreescucha = (cancion) => {
  if (preescuchaActiva.value === cancion) {
    detenerPreescucha();
  } else {
    iniciarPreescucha(cancion);
  }
};

const iniciarPreescucha = (cancion) => {
  detenerPreescucha();
  preescuchaActiva.value = cancion;
  audio = new Audio("ruta/a/la/cancion");
  audio.volume = 0.5;
  audio.play();
  setTimeout(detenerPreescucha, 20000);
};

const detenerPreescucha = () => {
  if (audio) audio.pause();
  preescuchaActiva.value = null;
};

// Ajustar el volumen
const ajustarVolumen = (event) => {
  if (audio) audio.volume = event.detail.value;
};

// Búsqueda de canciones
const buscarCancion = (event) => {
  const query = event.target.value.toLowerCase();
  cancionesFiltradas.value = canciones.value.filter(cancion =>
    cancion.nombreC.toLowerCase().includes(query)
  );
};

// Acción al enviar una canción
const enviarCancion = (cancion) => {
  console.log(`Enviando la canción: ${cancion}`);
};
</script>


<style scoped>
.center-title {
  text-align: center;
}

.scrollable-list {
  max-height: 500px;
  overflow-y: auto;
}

.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(48, 48, 48, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: rgb(47, 47, 47);
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  padding: 20px;
}

.scrollable-songs {
  max-height: 600px;
  overflow-y: auto;
}

.no-results-message {
  text-align: center;
  font-size: 1rem;
  color: white;
  margin-top: 10px;
}
</style>

