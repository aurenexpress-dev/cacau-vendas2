const topShareLinks = document.querySelectorAll('.top-share .share-link');

document.querySelectorAll('.dropdown').forEach(item => {
    item.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('open');
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(item => {
        item.classList.remove('open');
    });
});



topShareLinks.forEach(link => {
    link.addEventListener('click', function () {
        const dataEvent = this.getAttribute('data-event');

        gaSendEvent({
            category: "Botão Seguir Rede Sociais",
            action: "Follow Social Medias",
            label: dataEvent,
            noninteraction: false
        });
    });
});