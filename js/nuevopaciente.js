const formAgregarPaciente = document.querySelector('#formAgregarPaciente');

if (formAgregarPaciente) {
    formAgregarPaciente.addEventListener('submit', agregarPaciente);
}

function agregarPaciente(event) {
    event.preventDefault();
    const nombre = document.querySelector('#nombre').value.trim();
    const especie = parseInt(document.querySelector('#especie').value);
    const sexo = parseInt(document.querySelector('#sexo').value);
    const raza = document.querySelector('#raza').value.trim();
    const propietario = document.querySelector('#propietario').value.trim();

    const razaEsValida = validarTexto(raza) && raza.length >= 3;
    if (razaEsValida === false) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Indique un tipo de raza, de tratarse de un animal exotico coloque su especie',
            showConfirmButton: false,
            timer: 3000
        });
        return;
    }

    const propietarioEsValido = validarTexto(propietario) && propietario.length >= 5;
    if (propietarioEsValido === false) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Coloque Nombre y Apellido del propietario',
            showConfirmButton: false,
            timer: 2000
        });
        return;
    }

    const nuevoPaciente = {
        especie: especie,
        raza: raza,
        sexo: sexo,
        nombre: nombre,
        propietario: propietario
    };

    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes.push(nuevoPaciente);

    localStorage.setItem('pacientes', JSON.stringify(pacientes));

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Paciente agregado correctamente',
        showConfirmButton: false,
        timer: 1000
    }).then(() => {
        window.location.href = '../index.html';
    });
}

function validarTexto(texto) {
    return /^[a-zA-Z\s]+$/.test(texto);
}