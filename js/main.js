const imagenes = {
    'canino-macho': './img/perrom.png',
    'canino-hembra': './img/perroh.png',
    'felino-macho': './img/gatom.png',
    'felino-hembra': './img/gatoh.png',
    'default': './img/default.png'
};

class Paciente {
    constructor(especie, raza, sexo, nombre, propietario = '', imagenes = {}) {
        const tipoEspecie = ['canino', 'felino', 'exotico'];
        const tipoSexo = ['macho', 'hembra'];

        this.especie = tipoEspecie[especie] || 'default';
        this.raza = raza;
        this.sexo = tipoSexo[sexo] || 'default';
        this.nombre = nombre;
        this.propietario = propietario;
        this.imagenes = imagenes;
        this.img = this.obtenerImagen();
    }

    obtenerImagen() {
        return this.imagenes[`${this.especie}-${this.sexo}`] || this.imagenes['default'];
    }

    toJSON() {
        return {
            especie: ['canino', 'felino', 'exotico'].indexOf(this.especie),
            raza: this.raza,
            sexo: ['macho', 'hembra'].indexOf(this.sexo),
            nombre: this.nombre,
            propietario: this.propietario,
            img: this.img
        };
    }
}

async function cargarPacientes() {
    const pacientesJSON = localStorage.getItem('pacientes');
    const pacientesData = JSON.parse(pacientesJSON) || [];
    return pacientesData.map(data => new Paciente(data.especie, data.raza, data.sexo, data.nombre, data.propietario, imagenes));
}

function guardarPacientes(pacientes) {
    const pacientesJSON = JSON.stringify(pacientes.map(paciente => paciente.toJSON()));
    localStorage.setItem('pacientes', pacientesJSON);
}

function renderPacientes(pacientes) {
    const containerCards = document.querySelector('#container');
    const template = document.querySelector('#card-template');
    const fragment = document.createDocumentFragment();

    pacientes.forEach((paciente, index) => {
        const copiaPlantilla = template.content.cloneNode(true);
        const cardTitle = copiaPlantilla.querySelector('.card-title');
        const cardEspecie = copiaPlantilla.querySelector('.card-especie');
        const cardSexo = copiaPlantilla.querySelector('.card-sexo');
        const cardRaza = copiaPlantilla.querySelector('.card-raza');
        const cardPropietario = copiaPlantilla.querySelector('.card-propietario');
        const img = copiaPlantilla.querySelector('img');
        const btnEliminar = copiaPlantilla.querySelector('.btn-eliminar');
        const btnVerPaciente = copiaPlantilla.querySelector('.btn-ver-paciente');

        if (cardTitle && cardEspecie && cardSexo && cardRaza && cardPropietario && img && btnEliminar && btnVerPaciente) {
            cardTitle.textContent = paciente.nombre;
            cardEspecie.textContent = `Especie: ${paciente.especie}`;
            cardSexo.textContent = `Sexo: ${paciente.sexo}`;
            cardRaza.textContent = `Raza: ${paciente.raza}`;
            cardPropietario.textContent = `Propietario: ${paciente.propietario}`;
            img.src = paciente.img;

            btnEliminar.setAttribute('data-bs-index', index);
            btnEliminar.addEventListener('click', () => {
                eliminarPaciente(index);
                Swal.fire({
                    position: "center",
                    icon: "info",
                    title: "Paciente eliminado correctamente",
                    showConfirmButton: false,
                    timer: 3000
                });
            });

            btnVerPaciente.setAttribute('data-bs-index', index);
            btnVerPaciente.addEventListener('click', () => {
                mostrarDetallesPaciente(paciente, index);
            });

            fragment.appendChild(copiaPlantilla);
        }
    });

    containerCards.innerHTML = '';
    containerCards.appendChild(fragment);
}

function eliminarPaciente(index) {
    cargarPacientes().then(pacientes => {
        pacientes.splice(index, 1);
        guardarPacientes(pacientes);
        inicializar();
    });
}

function mostrarDetallesPaciente(paciente, index) {
    const nombreInput = document.querySelector('#mdnombre');
    const especieSelect = document.querySelector('#mdespecie');
    const sexoSelect = document.querySelector('#mdsexo');
    const razaInput = document.querySelector('#mdraza');
    const propietarioInput = document.querySelector('#mdpropietario');
    const codigoInput = document.querySelector('#mdcodigo');

    if (nombreInput && especieSelect && sexoSelect && razaInput && propietarioInput && codigoInput) {
        nombreInput.value = paciente.nombre;
        especieSelect.value = ['canino', 'felino', 'exotico'].indexOf(paciente.especie);
        sexoSelect.value = ['macho', 'hembra'].indexOf(paciente.sexo);
        razaInput.value = paciente.raza;
        propietarioInput.value = paciente.propietario;
        codigoInput.value = index;

        const modal = new bootstrap.Modal(document.getElementById('pacienteModal'));
        modal.show();
    }
}

document.querySelector('#editFormModal').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.querySelector('#mdnombre').value;
    const especie = parseInt(document.querySelector('#mdespecie').value, 10);
    const sexo = parseInt(document.querySelector('#mdsexo').value, 10);
    const raza = document.querySelector('#mdraza').value;
    const propietario = document.querySelector('#mdpropietario').value;
    const index = parseInt(document.querySelector('#mdcodigo').value, 10);

    cargarPacientes().then(pacientes => {
        const paciente = pacientes[index];
        if (paciente) {
            paciente.nombre = nombre;
            paciente.especie = ['canino', 'felino', 'exotico'][especie];
            paciente.sexo = ['macho', 'hembra'][sexo];
            paciente.raza = raza;
            paciente.propietario = propietario;
            paciente.img = paciente.obtenerImagen();

            guardarPacientes(pacientes);
            inicializar();
        }
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById('pacienteModal'));
    modal.hide();
});

function filterPacientes(pacientes) {
    const searchInput = document.querySelector('#searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPacientes = pacientes.filter(paciente =>
            paciente.nombre.toLowerCase().includes(searchTerm) ||
            paciente.raza.toLowerCase().includes(searchTerm) ||
            paciente.especie.toLowerCase().includes(searchTerm) ||
            paciente.sexo.toLowerCase().includes(searchTerm) ||
            paciente.propietario.toLowerCase().includes(searchTerm)
        );
        renderPacientes(filteredPacientes);
    });
}

function inicializar() {
    cargarPacientes().then(pacientes => {
        if (pacientes.length === 0) {
            listaPacientes();
            cargarPacientes().then(pacientes => {
                renderPacientes(pacientes);
                filterPacientes(pacientes);
            });
        } else {
            renderPacientes(pacientes);
            filterPacientes(pacientes);
        }
    });
}

function listaPacientes() {
    const pacientes = [
        new Paciente(0, 'caniche', 1, 'Lola', 'Camila Gonzalez', imagenes),
        new Paciente(0, 'mestizo', 0, 'Hans', 'Raul Perez', imagenes),
        new Paciente(1, 'siames', 0, 'Homero', 'Florencia Garcia', imagenes),
        new Paciente(0, 'bulldog frances', 1, 'India', 'Monica Guzman', imagenes),
        new Paciente(0, 'caniche', 1, 'Sofia', 'Cristian Arroyo', imagenes),
        new Paciente(1, 'mestizo', 1, 'Carmina', 'Clemantina Mamani', imagenes),
        new Paciente(1, 'mestizo', 0, 'Chino', 'Flavia Sanchez', imagenes),
        new Paciente(0, 'ovejero aleman', 0, 'Terry', 'Marina Peres', imagenes),
        new Paciente(0, 'mestizo', 1, 'Rubia', 'Juan Cruz Diaz', imagenes),
        new Paciente(0, 'cane corso', 1, 'Akiva', 'Gabriel Reynoso', imagenes),
        new Paciente(1, 'mestizo', 1, 'Michi', 'Julian Fernandez', imagenes),
        new Paciente(0, 'pitbull', 0, 'Toro', 'Mario Castro', imagenes),
        new Paciente(0, 'teckel', 1, 'Isadora', 'Ismael Flores', imagenes),
    ];

    guardarPacientes(pacientes);
}

inicializar();