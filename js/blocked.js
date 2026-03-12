jQuery(function() {
    jQuery("#user-exp-login-spinner").remove();
    if (jQuery(".salvar-conteudo-materia").length > 0) {
        if(disabledFavoritoSemAssinatura() === false){
            jQuery(".salvar-conteudo-materia").css("display", "inline-block");
            jQuery(".salvar-conteudo-materia .favoritar").removeClass("d-none");
        }else{
            jQuery(".salvar-conteudo-materia").css("display", "none");
            jQuery(".salvar-conteudo-materia .favoritar").addClass("d-none");
        }
    }
});

function construct_alert_usersonly() {
    if (jQuery("#botao-seguir-author-blog .favoritar").length > 0) {
        if(disabledFavoritoSemAssinatura() === false){
            jQuery("#botao-seguir-author-blog .favoritar").addClass("favoritar-deslogado");
            jQuery("#botao-seguir-author-blog .favoritar").removeClass("d-none");
            jQuery("#botao-seguir-author-blog").css("position", "relative");
            jQuery("#botao-seguir-author-blog").addClass("show");
        }else{
            jQuery("#botao-seguir-author-blog .favoritar").removeClass("favoritar-deslogado");
            jQuery("#botao-seguir-author-blog .favoritar").addClass("d-none");
            jQuery("#botao-seguir-author-blog").removeClass("show");
        }
    }
    if (jQuery("#botao-seguir-author").length > 0) {
        if(disabledFavoritoSemAssinatura() === false){
            jQuery("#botao-seguir-author").css("display", "inline-block");
            jQuery("#botao-seguir-author").css("position", "relative");
            jQuery("#botao-seguir-author .favoritar").addClass("favoritar-deslogado");
            jQuery("#botao-seguir-author .favoritar").removeClass("d-none");
        }else{
            jQuery("#botao-seguir-author").css("display", "none");
            jQuery("#botao-seguir-author .favoritar").removeClass("favoritar-deslogado");
            jQuery("#botao-seguir-author .favoritar").addClass("d-none");
        }
    }

    jQuery("#botao-seguir-author-blog, #botao-seguir-author, .salvar-conteudo-materia").on("click", function (e) {
        if (e.target.tagName.toLowerCase() === 'a') {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (jQuery("#users_only").is(":visible")) {
            jQuery("#users_only").remove();
        }
        else {
            if (jQuery(e.target).attr("id") === "botao-seguir-author-blog") {
                jQuery(e.target).addClass("favoritar-deslogado-top");
            }

            if (jQuery(e.target).find('#users_only').length) {
                if (jQuery("#users_only").is(":visible")) {
                    if (
                        !jQuery(e.target).hasClass("alert_onboarding") &&
                        !jQuery(e.target).parent("div.alert_onboarding").length
                    ) {
                        jQuery(".alert_onboarding").remove();
                    }
                } else {
                    jQuery("#users_only").show();
                }
            } else {
                init_alert_usersonly(e);
            }
        }
    });
}

function init_alert_usersonly(e) {
    jQuery("#users_only").remove();
    let usersonly = jQuery("<div></div>");
    usersonly.addClass("alert_onboarding");
    usersonly.attr("id", "users_only");

    const request = jQuery.ajax({
        type: "POST",
        url: ajaxOnboarding.url,
        dataType: "html",
        data: {
            nonce: ajaxOnboarding.nonce,
            action: 'generateAssinaturaUrl',
        }
    });
    request.done(function (msg) {
         usersonly.html(
                "<span>Esta funcionalidade só está disponível para assinantes. Faça <a href='"+window.location.origin+"/login/?eventLabel=Tela%2de%2login%2onboarding&url-retorno="+window.location.href+"' class='btn' id='login'>seu login</a> ou <a href='"+msg+"'>assine já</a>.</span>"
            );
            generate_pop(e, usersonly)
    });
    request.fail( function(msg) {
        usersonly.html(
                "<span>Esta funcionalidade só está disponível para assinantes. Faça <a href='"+window.location.origin+"/login/?eventLabel=Tela%2de%2login%2onboarding&url-retorno="+window.location.href+"' class='btn' id='login'>seu login</a> ou <a href='/ofertas'>assine já</a>.</span>"
            );
            generate_pop(e, usersonly)
    })
}

function generate_pop(e, usersonly) {
    let $target = jQuery(e.target).closest('.icone-salvar, .salvar-conteudo-materia');
    if (jQuery(e.target).hasClass("seguir-author")) {
        if (jQuery(".seguir-author").length > 1) {
            usersonly.addClass("alert_double_author");

            jQuery("#botao-seguir-author").append(usersonly);
            jQuery("#users_only").show();
            jQuery("#users_only").on("click", function (event) {
                jQuery(event.target).show();
            });
        }
        // Se tem apenas 1 autor
        else {
            jQuery(e.target).append(usersonly);
            jQuery("#users_only").show();
            jQuery("#users_only").on("click", function (event) {
                jQuery(event.target).show();
            });
        }
    }
    else {
        if ($target.closest('.salvar-conteudo-materia').length) {
            $target.closest('.salvar-conteudo-materia').append(usersonly);
        }
        else {
            jQuery(e.target).append(usersonly);
        }
        
        jQuery("#users_only").show();
        jQuery("#users_only").on("click", function (event) {
            jQuery(event.target).show();
        });
    }

    jQuery(document.body).on("click", function (event) {
        if (
            !jQuery(event.target).hasClass("alert_onboarding") &&
            !jQuery(event.target).parent("div.alert_onboarding").length
        ) {
            jQuery(".alert_onboarding").hide();
        }
    });
}