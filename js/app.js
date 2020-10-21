const resultado = document.getElementById('resultado');
const formulario = document.getElementById('formulario');
const registrosXPag = 30;
let totalPaginas;
let iterador;

window.onload = () => {
    formulario.addEventListener('submit', validarformulario);
}

function validarformulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.getElementById('termino').value;

    if(terminoBusqueda === '') {
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes(terminoBusqueda);
}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class"block sm:inline>${mensaje}</span>
        `;
        formulario.appendChild(alerta);

        setTimeout(() => {
        alerta.remove();
        }, 3000);
    }
    
}

function buscarImagenes(termino) {
    const key = '16192779-4ece6d6ebe2127d51a3d2085b';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=100`;
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            mostrarImagenes(resultado.hits);

            totalPaginas = calcularPaginas(resultado.totalHits);
        });
}

// generador para registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosXPag));
}

function mostrarImagenes(imagenes) {
    limpiarHTML();
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                        <img class="w-full imagen" src="${previewURL}">
                    </a>

                    <div class="p-4">
                        <p class="font-bold">${likes}<span class="font-light"> Me gusta</span></p>
                        <p class="font-bold">${views}<span class="font-light"> Veces vista</span></p>
                    </div>

                </div>
            </div>
        `;
    });

    imprimirPaginador();

}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);
    console.log(iterador.next().value);
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.remove(resultado.firstChild);
    }
}