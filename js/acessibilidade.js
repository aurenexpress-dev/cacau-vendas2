jQuery(document).ready(function($) {
    var initialStyles = {};
    captureInitialStyles();
    applySavedPreferences();

    $('#dark-mode-toggle').click(function() {
        $('body').toggleClass('dark-mode');
        savePreference('darkMode', $('body').hasClass('dark-mode'));
    });

    $('#increase-font').click(function() {
        var currentFontSizeState = getCookie('fontSizeState') || 'normal';
        $(this).prop('disabled', true);
        captureInitialStyles();
        adjustFontSizeAndLineHeight('section.content *:not(i), div.post-header *:not(i), figure.featured-media *', 2);
        var newFontSizeState = currentFontSizeState === 'normal' ? 'larger' : 'normal';
        savePreference('fontSizeState', newFontSizeState);
        adjustButtonStates(newFontSizeState);
    });

    $('#decrease-font').click(function() {
        var currentFontSizeState = getCookie('fontSizeState') || 'normal';
        $(this).prop('disabled', true);
        captureInitialStyles();
        adjustFontSizeAndLineHeight('section.content *:not(i), div.post-header *:not(i), figure.featured-media *', -2);
        var newFontSizeState = currentFontSizeState === 'normal' ? 'smaller' : 'normal';
        savePreference('fontSizeState', newFontSizeState);
        adjustButtonStates(newFontSizeState);
    });

    function captureInitialStyles() {
        $('section.content *:not(i), div.post-header *:not(i), figure.featured-media *').each(function(index) {
            var el = $(this);
            var tagId = el.prop("tagName") + index;
            initialStyles[tagId] = {
                fontSize: el.css('font-size'),
                lineHeight: el.css('line-height')
            };
        });
    }

    function adjustFontSizeAndLineHeight(selector, adjustment) {
        $(selector).each(function(index) {
            var el = $(this);
            var tagId = el.prop("tagName") + index; 
            var initialFontSize = parseInt(initialStyles[tagId].fontSize);
            var initialLineHeight = parseFloat(initialStyles[tagId].lineHeight);
            
            el.css({
                'font-size': (initialFontSize + adjustment) + 'px',
                'line-height': (initialLineHeight + adjustment) + 'px'
            });
        });
    }

    function adjustButtonStates(fontSizeState) {
        switch(fontSizeState) {
            case 'larger':
                $('#increase-font').prop('disabled', true);
                $('#decrease-font').prop('disabled', false);
                break;
            case 'smaller':
                $('#increase-font').prop('disabled', false);
                $('#decrease-font').prop('disabled', true);
                break;
            default: // 'normal'
                $('#increase-font').prop('disabled', false);
                $('#decrease-font').prop('disabled', false);
                break;
        }
    }

    function applySavedPreferences() {
        if (getCookie('darkMode') === 'true') {
            $('body').addClass('dark-mode');
        }

        var fontSizeState = getCookie('fontSizeState') || 'normal';
        if(fontSizeState === 'larger') {
            adjustFontSizeAndLineHeight('section.content *:not(i), div.post-header *:not(i), figure.featured-media *', 2);
        } else if(fontSizeState === 'smaller') {
            adjustFontSizeAndLineHeight('section.content *:not(i), div.post-header *:not(i), figure.featured-media *', -2);
        } 
        adjustButtonStates(fontSizeState);
    }

    function savePreference(name, value) {
        var expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        document.cookie = name + '=' + value + ';expires=' + expirationDate.toUTCString() + ';path=/';
    }

    function getCookie(name) {
        var cookieArr = document.cookie.split(';');
        for(var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split('=');
            if (name == cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }

    const btn = document.querySelector('.new-share-button');
    const box = document.querySelector('.share-box');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    btn.addEventListener('click', function (e) {
        e.stopPropagation();

        if (isMobile && navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            }).catch(err => console.log('Erro ao compartilhar', err));
            return;
        }

        btn.classList.toggle('active');
    });

    document.addEventListener('click', function () {
        if (!isMobile) {
            btn.classList.remove('active');
        }
    });

    if (box) {
        box.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    const copyButton = document.querySelector(".copy-link");
    const msg = document.getElementById("copy-message");
    copyButton.addEventListener("click", function (e) {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                msg.style.display = "block";
                setTimeout(() => {
                    msg.style.display = "none";
                }, 1000);
            })
            .catch(() => {
                msg.textContent = "Erro ao copiar!";
                msg.style.display = "block";
                setTimeout(() => {
                    msg.style.display = "none";
                    msg.textContent = "Link copiado!";
                }, 1000);
            });
    });

    const shareButtons = document.querySelectorAll('.share-content');
    shareButtons.forEach(button => {
        button.addEventListener('click', function () {
            const dataEvent = this.getAttribute('data-event');
            gaSendEvent({
                "category": "Compartilhamento de Matéria",
                "action": "Share Post",
                "label": dataEvent,
            });
            return;
        });
    });
});