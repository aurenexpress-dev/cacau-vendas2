jQuery(function() {
  //check_cookie_critica();

 if( typeof AbrilScriptsExec != 'undefined' ){
  console.log('AbrilScriptsExec instanciado');
   if ( AbrilScriptsExec.checkCookieListControl("abril_notcritica") || !checa_criticas() ) {
          console.log('Retira Notificacao critica');
          AbrilScriptsExec.removeFunctionList("check_cookie_critica");
      } 
          AbrilScriptsExec.setLoadStatus("check_cookie_critica");
  }else{
    console.log('AbrilScriptsExec nao instanciado');
  }

  if( AbrilScriptsExec.checkDirectExec("check_cookie_critica") ){
    check_cookie_critica();
  }  

  jQuery(".user-alert-close img").on("click", function () {
    fechar_notificacoes();
  });
});

// EVENTOS GA EXP LOGADA
jQuery("#user-exp-ctrl").on("click", function (e) {
  gaSendEvent(
      "",
      "Usuário autenticado",
      "View",
      "",
      ""
  );

  var userRow = document.querySelectorAll('.user-exp-row .textlink a')
  userRow.forEach(function(notification) {
    notification.addEventListener('click', function() {
      var itemName = jQuery(this).closest('.user-exp-row').find('.user-alert-title mark').text();
      gaSendEvent(
        "",
        "Usuário autenticado",
        "Click",
        itemName,
        ""
      );

    })
  })

  jQuery(".user-alert-title a").on("click", function (e) {
  var alertItem = jQuery(this).closest('.user-exp-row').find('.user-alert-qt').text();
  gaSendEvent(
        "",
        "Usuário autenticado",
        "Click",
        alertItem,
        ""
    );
  })

})

jQuery(".user-alert-close").on("click", function (e) {
  gaSendEvent(
      "",
      "Usuário autenticado",
      "Click",
      "Fechou box de notificação",
      ""
  );
})

jQuery(".user-exp-account").on("click", function (e) {
  gaSendEvent(
      "",
      "Usuário autenticado",
      "Click",
      "Entrou no perfil",
      ""
  );
})

jQuery(".user-exp-logout").on("click", function (e) {
  gaSendEvent(
      "",
      "Usuário autenticado",
      "Click",
      "Efetuou logoff",
      ""
  );
})


function fechar_notificacoes() {
  jQuery('#user-exp-ctrl').css("pointerEvents", "auto")
  jQuery("#header-user-exp-ctrl").css("pointerEvents", "auto");
  jQuery("#user-exp-menu").removeClass("show");
  jQuery("#user-exp-menu-fade").removeClass("show");
  jQuery(".wrapper_pop_onboarding").hide();
  jQuery(".wrapper_pop_onboarding").removeClass("show");
  jQuery("#user-exp-login-spinner").hide();
  jQuery("html").removeClass("user-exp-overflow");


    if (jQuery(".user-alert-critico").length > 0) {
      if( typeof AbrilScriptsExec != 'undefined' ){
        AbrilScriptsExec.createCookieListControl("abril_notcritica");
      }
    }

} 
function set_click_critica() {
  jQuery(".user-alert-critico a").on("click", function() {
    if( typeof AbrilScriptsExec != 'undefined' ){
      AbrilScriptsExec.createCookieListControl("abril_notcritica");
    }
  });
}
/* Notificação Crítica */
function check_cookie_critica() {

  if( typeof AbrilScriptsExec != 'undefined' ){
    if( AbrilScriptsExec.checkCookieListControl("abril_notcritica") ){
      return;
    }
  }
  
  const storageUserOnboarding = "abrilAssetsUser";

  let temCritico = 'n';
  unicNotifications = JSON.parse(localStorage.getItem('abrilNotificacoes'));

  if( unicNotifications.notifications == null ){
    return;
  }else{
      if( !Array.isArray(unicNotifications.notifications) ){
        return;
      }
  }

  unicNotifications.notifications.forEach((msg, i) => {

            if ('sim' === msg.critico && temCritico == 'n') {
                  jQuery("#user-exp-menu").addClass("show");
                  jQuery("#user-exp-menu-fade").addClass("show");
                    temCritico = 's';
                    if( typeof AbrilScriptsExec != 'undefined' ){
                        AbrilScriptsExec.createCookieListControl("abril_notcritica");
                    }
                        exec_criticas();
                }
            })

}

function disabledFavoritoSemAssinatura(){
  if(typeof ajaxExpLogada.disabledFavoritoSemAssinatura !== 'undefined'){
    if(ajaxExpLogada.disabledFavoritoSemAssinatura === 'yes'){
      var codProds = localStorage.getItem('AbrilProductsUser');
      if(codProds === null){
        return true;
      }

      if(codProds.length === 0){
        return true;
      }
    }
  }
  return false;
}

function exec_criticas(){
            jQuery("#user-exp-menu").addClass("show");
            jQuery("#user-exp-menu-fade").addClass("show");
            if (jQuery(".wrapper_pop_onboarding").length !== 0 && jQuery(".wrapper_pop_onboarding").hasClass("show")) {
              jQuery(".user-exp-menu-fade-alerts").addClass("show");
            }
}

function checa_criticas(){

  const storageUserOnboarding = "abrilAssetsUser";
  let temCritico = 'n';
  unicNotifications = JSON.parse(localStorage.getItem('abrilNotificacoes'));

  if( unicNotifications == null ){
    return false;
  }else{
      if( !Array.isArray(unicNotifications.notifications) ){
        return false;
      }
  }
  unicNotifications.notifications.forEach((msg, i) => {

            if ('sim' === msg.critico && temCritico == 'n') {
                    temCritico = 's';
                }
            })

  if( temCritico == 's' ){
    return true;
  }


  return false;
}


