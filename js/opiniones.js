const cuerpoCarouselOp = document.getElementById("cuerpoCarouselOp");
const opnionesSection = document.getElementById("opnionesSection");
const elemCarousel = document.getElementById("opniones");

const opiniones = [
    "Tuve una experiencia maravillosa con el equipo de esta clínica. El personal fue muy atento y mi mascota recibió el mejor cuidado posible. Sin duda, recomiendo sus servicios.",
    "Recomiendo esta clínica veterinaria a todos los dueños de mascotas. La atención es excelente, el personal es amable, y siempre siento que mi mascota está en buenas manos.",
    "Estoy muy feliz con el servicio recibido en esta clínica. La calidad de la atención y la amabilidad del personal hicieron que la experiencia fuera muy positiva para mi gato y para mí.",
    "Salvaron a mi perro, estoy muy feliz y agradecida eternamente",
    "La clínica veterinaria es increíble. Los veterinarios son expertos y se nota que realmente les importa el bienestar de las mascotas. Recomiendo encarecidamente sus servicios.",
    "Excelente atención y cuidado para mi perro. El personal es muy profesional y amable. Estoy muy agradecido por el servicio.",
    "Recomiendo esta clínica veterinaria a todos los dueños de mascotas. La atención es excelente, el personal es amable, y siempre siento que mi mascota está en buenas manos."
];

function obtenerOpinionAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * opiniones.length);
    return opiniones[indiceAleatorio];
}

function loadOpiniones(cliente, isActive = false) {
    const carouselItem = document.createElement('div');
    carouselItem.className = `carousel-item ${isActive ? 'active' : ''}`;

    carouselItem.innerHTML = `
        <div class="d-flex flex-column align-items-center">
            <p class="lead text-dark mx-4 mx-md-5 clienteOpinion">
                "${cliente.opinion}"
            </p>
            <div class="mt-4 mb-3">
                <img src="${cliente.picture.medium}" class="rounded-circle img-fluid shadow-1-strong clienteImagen" alt="foto perfil cliente" width="100" height="100" />
            </div>
            <p class="text-dark mb-3 clienteNombre">${cliente.name.last} ${cliente.name.first}</p>
        </div>
    `;

    cuerpoCarouselOp.appendChild(carouselItem);
}


function inicializarCarrusel() {
    new bootstrap.Carousel(elemCarousel, {
        interval: 6000,
        ride: 'carousel'
    });
}

fetch('https://randomuser.me/api/?results=5')
    .then(response => response.json())
    .then(data => {
        const clientes = data.results;

        opnionesSection.classList.remove("d-none");

        clientes.forEach((cliente, indice) => {
            cliente.opinion = obtenerOpinionAleatoria();
            loadOpiniones(cliente, indice === 0);
        });

        inicializarCarrusel();
    })