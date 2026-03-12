$( document ).ready(function() {
    if ($("body .ads-footer").length > 0) {
        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && $("body .ads-footer").is(":visible")) {
                $('body').addClass('isBottom');
            } else {
                $('body').removeClass('isBottom');
            }
        };
    }

});