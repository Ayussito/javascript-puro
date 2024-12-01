function hola(){
    console.log("holaaaa!");
}
// Función para forzar el modo oscuro
function enableDarkMode() {
document.body.classList.add("dark");
}
// Función para cargar datos del JSON
async function cargarDatos() {
    var modal = document.querySelector('ion-modal');

    try {
        // Hacer la petición al archivo JSON
        const respuesta = await fetch('data/artistas.json');
        
        // Verificar si la respuesta es exitosa
        if (!respuesta.ok) {
            throw new Error(`HTTP error! Status: ${respuesta.status}`);
        }

        // Convertir la respuesta a JSON
        const data = await respuesta.json();

        const artistList = document.getElementById("artist-list");
        const searchBar = document.getElementById("search-artist");
        const noArtistsMessage = document.getElementById("no-artists");

        const renderArtists = (filter = " ") => {
        artistList.innerHTML = "";
        const filteredArtists = data.artistas.filter(artist =>
            artist.artista.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredArtists.length === 0) {
            noArtistsMessage.style.display = "block";
        } else {
            noArtistsMessage.style.display = "none";
            filteredArtists.forEach(artist => {
            const item = document.createElement("ion-item");
            const thumbnail = document.createElement("ion-thumbnail");
            const img = document.createElement("img");
            const label = document.createElement("p");
            const button = document.createElement("ion-button");

            img.src = artist.foto;
            thumbnail.slot = "start";
            thumbnail.appendChild(img);

            label.textContent = artist.artista;

            button.textContent = "Ver canciones";
            button.className = "botones-c";
            button.addEventListener("click", () => showSongs(artist));

            item.appendChild(thumbnail);
            item.appendChild(label);
            item.appendChild(button);
            artistList.appendChild(item);
            });
        }
        };

        const showSongs = (artist) => {
        //alert(`Canciones de ${artist.artista}: ${artist.canciones.map(c => c.nombreC).join(", ")}`);
            modal.isOpen = true
            let contenido = document.getElementById("contenido-modal");
            let htmlC= '<div class="scrollable-list"> <ion-list>';
            artist.canciones.forEach(cancion => {
                htmlC += "<ion-item><p>"+cancion.nombreC+"</p> <ion-button style='margin-left:auto'>Enviar</ion-button></ion-item>"
            })
            htmlC += "</ion-list></div>";
            contenido.innerHTML=htmlC;
        };

        searchBar.addEventListener("ionInput", (event) => {
            renderArtists(event.target.value);
        });

        renderArtists(" ");
        console.log(data);
    } catch (error) {
        console.error('Error al cargar el JSON:', error);
    }
}

// Cosas que hacer cuando cargue la pagina
document.addEventListener("DOMContentLoaded", () => {
    enableDarkMode();
    cargarDatos();
});





