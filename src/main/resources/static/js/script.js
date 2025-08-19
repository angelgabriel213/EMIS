function cambiarContenido(contenido) {
    var contents = document.querySelectorAll('.content');
    for(var i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
    }
    document.querySelector('.' + contenido).style.display = 'block';
}