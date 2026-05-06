// Seleccionamos la barra de navegación
const navbar = document.getElementById('navbar');

// Añadimos un escuchador de eventos para el scroll de la ventana
window.addEventListener('scroll', () => {
    // Si bajamos más de 50 píxeles, añadimos la clase 'scrolled'
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        // Si volvemos arriba, se la quitamos
        navbar.classList.remove('scrolled');
    }
});