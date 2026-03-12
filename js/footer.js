$(".menu-item-has-children > a").each(function (index) {
  $(".menu-item-has-children > a")[index].setAttribute("href", "javascript:;");
});

// Força git
// FUNÇÃO PARA VERIFICAR SE É FILHO
function childOf(c, p) {
  while ((c = c.parentNode) && c !== p);
  return !!c;
}

// VARIÁVEIS
var bodySelector = document.querySelector("body");

var mainHeader = document.querySelector("body>header");

var headerDiv = document.querySelector("body>header>div");

if (mainHeader) {
  var mainHeaderHeight = mainHeader.offsetHeight;
}

var scrollInicial = 0;

let sponsorSticky = document.getElementById("sponsored-sticky");
if (
  typeof document.getElementsByClassName("mobile-assine")[0] !== "undefined"
) {
  document.getElementsByClassName("mobile-assine")[0].style.top = "0";
}

// evento Veja BTE View
let elementView = [].slice.call(
  document.querySelectorAll(
    "body > main > section.block.edicao-semana > div > div > div.col-s-12.col-l-3 > div > div > a.link"
  )
);
const link_bte = document.querySelector(
  "body > main > section.block.edicao-semana > div > div > div.col-s-12.col-l-3 > div > div > a.link"
);
let wh_link_bte = "";
if (link_bte) {
  wh_link_bte = link_bte.getBoundingClientRect();
}
var view = false;

if ("" !== wh_link_bte && isInViewport(wh_link_bte)) {
} else if (
  "IntersectionObserver" in window &&
  "IntersectionObserverEntry" in window &&
  "intersectionRatio" in window.IntersectionObserverEntry.prototype
) {
  let elementViewObserver = new IntersectionObserver(function (
    entries,
    observer
  ) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        elementViewObserver.unobserve(entry.target);
      }
    });
  });

  elementView.forEach(function (elView) {
    elementViewObserver.observe(elView);
  });
}
// evento Veja BTE Click
if (link_bte) {
  link_bte.addEventListener("click", function () {
  });
}

// LISTENER PARA PEGAR SCROLL DA PÁGINA E DEIXAR MENU FIXADO
window.addEventListener("scroll", function (event) {
  var pageScrollTop = document.documentElement.scrollTop;

  if (pageScrollTop > mainHeaderHeight + 1) {
    if (
      typeof document.getElementsByClassName("mobile-assine")[0] !== "undefined"
    ) {
      document.getElementsByClassName("mobile-assine")[0].style.display =
        "block";
    }
    if (
      (mainHeader && mainHeader.style.paddingBottom == "0px") ||
      mainHeader.style.paddingBottom == ""
    ) {
      mainHeader.setAttribute(
        "style",
        "height:" + mainHeader.offsetHeight + "px"
      );
    }

    if (pageScrollTop > scrollInicial && window.innerWidth < 991) {
      setTimeout(function () {
        bodySelector.classList.remove("fixed");
      }, 200);
      if (sponsorSticky !== null) {
        setTimeout(function () {
          sponsorSticky.classList.remove("fixed");
        }, 200);
      }
      if (
        typeof document.getElementsByClassName("mobile-assine")[0] !==
        "undefined"
      ) {
        document.getElementsByClassName("mobile-assine")[0].style.top = "0";
        document.getElementsByClassName("mobile-assine")[0].style.marginBottom =
          "-5px";
        if ($("body.branded-hub")) {
          document.getElementsByClassName(
            "mobile-assine"
          )[0].style.marginBottom = "-15px";
        }
      }
      if (sponsorSticky !== null) {
        setTimeout(function () {
          sponsorSticky.classList.remove("fixed");
        }, 200);
      }
      bodySelector.classList.remove("searchOpen");
    } else {
      bodySelector.classList.add("fixed");
      if (
        typeof document.getElementsByClassName("mobile-assine")[0] !==
        "undefined"
      ) {
        document.getElementsByClassName("mobile-assine")[0].style.top = "52px";
      }
      if (sponsorSticky !== null) {
        sponsorSticky.classList.add("fixed");
      }
    }

    scrollInicial = pageScrollTop;
  } else {
    bodySelector.classList.remove("fixed");
    if (
      typeof document.getElementsByClassName("mobile-assine")[0] !== "undefined"
    ) {
      document.getElementsByClassName("mobile-assine")[0].style.top = "0";
    }
    if (sponsorSticky !== null) {
      sponsorSticky.classList.remove("fixed");
    }
    if (mainHeader) {
      mainHeader.setAttribute("style", "height:auto");
    }
  }
});



window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.requireJs = function (modules, cb) {
  window.require(modules, cb);
};

$(".ingrediente-check").on("click", function (event) {
  $(event.target).toggleClass("checked");
  $(event.target)
    .closest("li")
    .find(".ingrediente-formatado")
    .toggleClass("checked");
});

$(".ingrediente-formatado").on("click", function (event) {
  $(this).toggleClass("checked");
  $(this).prev().toggleClass("checked");
});

// Video Broadcast - Troca a thumbnail pelo iframe no cliq
$(".video-overlay").click(function (e) {
  e.preventDefault();
  var th = $(this);
  var embed_url = th.data("src");
  var width = th.width();
  var height = th.height();
  var iframe =
    '<iframe src="' +
    embed_url +
    '?mute=0&showinfo=0&controls=1&autoplay=1" width="' +
    width +
    '" height="' +
    height +
    '" frameborder="0" allow="autoplay" allowfullscreen></iframe>';
  th.parent().html(iframe);
});



$(
  ".injected-paywall .new-paywall-promotion-sign .new-paywall-promotion-sign-abril-button"
).click(function () {
  if (this.innerHTML == "Conheça outros planos") {

  } else {
    tituloOferta = jQuery(this).parent().parent().parent().parent();
    tituloOferta = tituloOferta[0].getAttribute("data-type");
    positionOferta =
      $(".new-paywall-promotion-sign-abril-button").index(this) + 1;

  }
});

if (window.location.href.indexOf("ofertas") > -1) {
  setTimeout(function () {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    var pushOrigem = urlParams.get("utm_source");
    var tipoOrigem = urlParams.get("tipo_origem");

  }, 3500);

  $(".new-paywall-promotion-sign-abril-button").click(function (e) {
    e.stopPropagation();
    tituloOferta = jQuery(this).parent().parent().parent().parent();
    tituloOferta = tituloOferta[0].getAttribute("data-type");
    positionOferta = $(".new-paywall-promotion-sign-abril-button").index(this) + 1;

  });
}

if (document.readyState !== "loading") {
  if ($("body.home").length > 0) {
    removeLazyloadViewport();
  }
} else {
  document.addEventListener("DOMContentLoaded", function () {
    if ($("body.home").length > 0) {
      removeLazyloadViewport();
    }
  });
}

// Script que remove o lazyload da primeira dobra na home
function removeLazyloadViewport() {
  let firstBlock = $(".block:first");

  $(firstBlock)
    .find("img")
    .each(function (index, value) {
      if (checkIsInViewport($(this))) {
        $(this).removeAttr("loading");
        $(this).removeClass("lazyload");
        $(this).removeClass("lazyloaded");

        let datasrc = $(this).data('src');
        $(this).attr('src', datasrc);
      }
    });
}

function checkIsInViewport(element) {
  var rect = element[0].getBoundingClientRect();
  var isInViewport =
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  return isInViewport;
}

// Script que faz o lazy loading em imagens de background em blocos
// Para utilizar, apenas incluir a classe lazy-bg no elemento e trocar o style="backgroung-img(url)", colocando o src como data-src, assim que ele aparecer no viewport a imagem será carregada
function lazyloadBlockImage() {
  let lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-bg"));

  if (
    "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "intersectionRatio" in window.IntersectionObserverEntry.prototype
  ) {
    let lazyBackgroundObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.backgroundImage =
            "url(" + entry.target.dataset.src + ")";
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function (lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }
}

if (document.readyState !== "loading") {
  lazyloadBlockImage();
  if ($("body.home").length > 0) {
    removeLazyloadViewport();
  }
} else {
  document.addEventListener("DOMContentLoaded", function () {
    lazyloadBlockImage();
    if ($("body.home").length > 0) {
    removeLazyloadViewport();
  }
  });
}

if(document.body.classList.contains('archive') || document.body.classList.contains('search-results')){

  $("#leia-mais-bairro").on("click", function () {
    console.log('entrou leia mais')
    $("#leia-mais-bairro")[0].style.display = "none";
    $("#leia-menos-bairro")[0].style.display = "block";
    $(".o-que-fazer")[0].style.display = "block";
    $(".onde-ir")[0].style.display = "block";
    $(".galeria-person")[0].style.display = "block";
    $('.sobre-bairro')[0].style.display = "block";
  });

  $("#leia-menos-bairro").on("click", function () {
    console.log('entrou leia menos')
    $("#leia-menos-bairro")[0].style.display = "none";
    $("#leia-mais-bairro")[0].style.display = "block";
    $('.sobre-bairro')[0].style.display = "-webkit-box";
    $(".o-que-fazer")[0].style.display = "none";
    $(".onde-ir")[0].style.display = "none";
    $(".galeria-person")[0].style.display = "none";
  });

  $(window).one('scroll',function() {
    $('.fotos-galeria-person').each(function( index ) {
      Fancybox.bind('[data-fancybox="gallery-tag-'+$( this )[0].getAttribute('dataIdGallery')+'"]', {
        groupAll: true,
      });
    });
  });
}

if(document.body.classList.contains('tag')){
  $('.fotos-galeria-person').each(function( index ) {
    Fancybox.bind('[data-fancybox="gallery-tag-'+$( this )[0].getAttribute('dataIdGallery')+'"]', {
      groupAll: true,
    });
  });
}

if ($("#completeText")[0] !== undefined) {
  var textoTagPerson = $("#completeText")[0].textContent;
  if (textoTagPerson.length > 189) {
    $("#ler-mais-person")[0].style.display = "initial";
    $("#ler-mais-person").on("click", function () {
      $("#shortText")[0].style.display = "none";
      $("#completeText")[0].style.display = "block";
      $("#ler-mais-person")[0].style.display = "none";
    });
  }
}

$(document).ready(function () {
  // verifica se a votação não está desabilitada pelo usuário já ter votado anteriormente
  let changeText = false;
  if ($(".kksr-disabled").length === 0) {
    // Altera o texto da avaliação se não tiver votado
    $("#kk_star_texto_avaliacao").text(
      "Avalie essa receita e confira a classificação geral"
    );

    // mapeia todos os elementos com a classe .kksr-star
    var starChild = $(".kksr-star")
      .map(function () {
        return this;
      })
      .get();

    // para cada elemento, encontra o elemento filho
    $(starChild).each(function (star, value) {
      $(star).each(function (el, value) {
        // se o elemento filho possui nota, continua
        if ($($(starChild)[value - 1]).attr("data-star") !== undefined) {
          // atribui um evento de one ao clique, para selecionar a nota que o usuário der
          $($(starChild)[value - 1]).one("click", function (el) {
            $("#custom_rating_recipe").css("pointerEvents", "none");
            let currentVote = $(this).attr("data-star");
            gaSendEvent({
              "category": "Star Rating",
              "action": "Voto do leitor",
              "label": currentVote + " estrelas",
            });

            // Descolore as estrelas do lado direito da votação se estiverem ativas
            if (currentVote < 5) {
              let activeStars = $(".kksr-stars-active .kksr-star");

              jQuery.each(activeStars, function (index, starActive) {
                if (index > currentVote - 1) {
                  let starChildrenActive = $(starActive).find(".kksr-icon");
                  starChildrenActive.css({
                    "background-image":
                      "url(/wp-content/plugins/kk-star-ratings-custom/src/core/public/svg/inactive.svg)"
                  });
                }
              });
            }

            let starSiblingsp = [];
            let starSiblingsPrev = $(this).prev();
            starSiblingsp.push($(this));

            // Colore as estrelas da votação
            for (xp = 0; xp < 4; xp++) {
              if ($(starSiblingsPrev).hasClass("kksr-star")) {
                starSiblingsp.push($(starSiblingsPrev));
                starSiblingsPrev = $(starSiblingsPrev).prev();
              }
            }

            jQuery.each(starSiblingsp, function (index, starPrev) {
              let starChildrenPrev = $(starPrev).find(".kksr-icon");
              starChildrenPrev.css({
                "background-image":
                  "url(/wp-content/plugins/kk-star-ratings-custom/src/core/public/svg/active.svg)"
              });
            });

            if (changeText === false) {
              setTimeout(function () {
                $("#kk_star_texto_avaliacao").text(
                  "Classificação média dos usuários"
                );

                // O plugin Star Rating possui também uma modificaçao que inclui o
                // setTimeout, ao dar manutenção em um, não esquecer o outro
              }, 1000);
            }
            changeText = true;
          });
        }
      });
    });
  } else {
    if ($("#kk_star_texto_avaliacao").length !== 0) {
      // Altera o texto da avaliação caso já tenha votado
      $("#kk_star_texto_avaliacao").text("Classificação média dos usuários");
    }
  }
});

if ($(".MGID").length > 0) {
  const mgidObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        mgidObserver.unobserve(entry.target);
        gaSendEvent({
          "category": "Parceiros",
          "action": "View",
          "label": "MGID",
          "ga_free": true
        });
      }
    });
  }, {});

  mgidObserver.observe(document.querySelector(".MGID"));
}

$(
    '.sidebarMenu > ul > li.menu-item:not(.menu-item-has-children) > a, .sidebarMenu > ul > li.menu-item.menu-item-has-children > ul.sub-menu > li.menu-item > a'
).click(function () {
    var href = $(this).attr('href')
    if ('javascript:;' !== href) {
        if (href.indexOf('://') >= 0) {
            gaSendEvent({
                category: 'Menu hamburguer',
                action: 'Click',
                label: href,
            })
        } else {
            gaSendEvent({
                category: 'Menu hamburguer',
                action: 'Click',
                label: window.location.origin + href,
            })
        }
    }
    window.location = href
    return false
})

let menuOpener = document.querySelectorAll(".menuOpener"),
  searchOpener = document.querySelectorAll(".searchOpener"),
  itemHasChildren = document.querySelectorAll(".menu-item-has-children");

// LISTENER PARA ABRIR MENU QUANDO CLICADO
menuOpener.forEach(function (e) {
  e.addEventListener("click", function () {

    bodySelector.classList.toggle("menuOpen");
    if (bodySelector.classList.contains("menuOpen")) {
      gaSendEvent({
        "category": "Menu hamburguer",
        "action": "View"
      });
    }
  });
});

// LISTENER PARA ABRIR A BUSCA QUANDO CLICADO
searchOpener.forEach(function (e) {
  e.addEventListener("click", function () {
    window.location.href = '/busca';
  });
});

// LISTENER PARA FECHAR A BUSCA E O MENU QUANDO CLICADO EM UM LUGAR QUE NÃO SEJAM ELES
document.addEventListener("click", function (e) {
  if (
    typeof e.target.className !== "undefined" &&
    typeof e.target.className !== "object"
  ) {
    if (
      e.target.className.indexOf("searchOpener") == -1 &&
      !childOf(e.target, document.querySelector(".searchOpener")) &&
      !childOf(e.target, document.querySelector(".searchOpener + form"))
    ) {
      bodySelector.classList.remove("searchOpen");
    }
    if (
      e.target.className.indexOf("menuCloser") !== -1 ||
      (e.target.className.indexOf("menuOpener") == -1 &&
        !childOf(e.target, document.querySelector(".sidebarMenu")) &&
        !childOf(e.target, document.querySelector(".menuOpener")))
    ) {
      bodySelector.classList.remove("menuOpen");
    }
  }
});

// LISTENER PARA ABRIR SUBMENU
itemHasChildren.forEach(function (e) {
  e.addEventListener("click", function () {
    this.classList.toggle("active");
  });
});



// Seleciona a tag body
const body = document.body;
let eventSent = false;

// Cria uma instância do MutationObserver
const observer = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (mutation.attributeName === 'class' && body.classList.contains('mg-additional-page') && !eventSent) {      
      // Envia o evento pro GA
      eventSent = true;
      gaSendEvent({
        "category": "MGID BackButton",
        "action": "Click",
        "label": ""
      });

      // Para de observar as mudanças
      observer.disconnect();
    }
  }
});

// Configura o observer para observar alterações nos atributos
observer.observe(body, { attributes: true });

// JS OFERTA AO VIVO TOPO COLAPSADO
function manterMenuOfertaNoHeader() {
  const body = document.querySelector('body');
  const subHeader = document.querySelector('.sub-header.container');
  const menu = document.querySelector('.menu-oferta-aovivo');

  if (!subHeader || !menu) return;

  const isFixed = body.classList.contains('fixed');

  if (isFixed) {
    const subHeaderBottom = subHeader.getBoundingClientRect().bottom;

    menu.style.setProperty('position', 'fixed', 'important');
    menu.style.setProperty('top', `${subHeaderBottom}px`, 'important');
    menu.style.setProperty('left', '0', 'important');
    menu.style.setProperty('width', '100%', 'important');
    menu.style.setProperty('z-index', '999', 'important');
  } else {
    menu.style.removeProperty('position');
    menu.style.removeProperty('top');
    menu.style.removeProperty('left');
    menu.style.removeProperty('width');
    menu.style.removeProperty('z-index');
  }
}

['scroll', 'resize', 'DOMContentLoaded', 'load'].forEach(event => {
  window.addEventListener(event, manterMenuOfertaNoHeader);
});


// EVENTO TEMPO REGRESSIVO DA OFERTA AO VIVO
function isFixedMode() {
  return document.body.classList.contains("fixed");
}

function formatFullTime(totalSeconds, useSideLabels = false) {
  const dias = Math.floor(totalSeconds / 86400);
  const horas = Math.floor((totalSeconds % 86400) / 3600);
  const minutos = Math.floor((totalSeconds % 3600) / 60);
  const segundos = totalSeconds % 60;

  const labelD = useSideLabels ? 'd' : 'Dias';
  const labelH = useSideLabels ? 'h' : 'Horas';
  const labelM = useSideLabels ? 'm' : 'Min';
  const labelS = useSideLabels ? 's' : 'Seg';

  const labelClass = useSideLabels ? 'label-side' : 'label-bottom';

  return `
    <span class="time-block"><span class="number">${dias}</span><span class="${labelClass}">${labelD}</span></span> :
    <span class="time-block"><span class="number">${String(horas).padStart(2, '0')}</span><span class="${labelClass}">${labelH}</span></span> :
    <span class="time-block"><span class="number">${String(minutos).padStart(2, '0')}</span><span class="${labelClass}">${labelM}</span></span> :
    <span class="time-block"><span class="number">${String(segundos).padStart(2, '0')}</span><span class="${labelClass}">${labelS}</span></span>
  `;
}

function formatTime(seconds, useSideLabels = false) {
  const hora = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minuto = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const segundo = String(seconds % 60).padStart(2, '0');

  const labelH = useSideLabels ? 'h' : 'Horas';
  const labelM = useSideLabels ? 'm' : 'Min';
  const labelS = useSideLabels ? 's' : 'Seg';

  const labelClass = useSideLabels ? 'label-side' : 'label-bottom';

  return `
    <span class="time-block"><span class="number">${hora}</span><span class="${labelClass}">${labelH}</span></span> :
    <span class="time-block"><span class="number">${minuto}</span><span class="${labelClass}">${labelM}</span></span> :
    <span class="time-block"><span class="number">${segundo}</span><span class="${labelClass}">${labelS}</span></span>
  `;
}

function getSecondsUntil(endTimeString) {
  const now = new Date();
  const endTime = new Date(endTimeString.replace(' ', 'T'));
  endTime.setHours(endTime.getHours() - 3);
  const diff = Math.floor((endTime.getTime() - now.getTime()) / 1000);
  return diff > 0 ? diff : 0;
}

function startCountdown() {
  const normalTimer = document.getElementById('timerRegressivoNormal');
  const fixedTimer = document.getElementById('timerRegressivoFixed');
  
  if (!normalTimer || !fixedTimer) {
    return;
  }

  const endTimeString = normalTimer.dataset.endTime;
  let countdown;

  function updateTimer() {
    const totalSeconds = getSecondsUntil(endTimeString);

    if (totalSeconds <= 0) {
      clearInterval(countdown);

      const finalHTMLNormal = formatTime(0, false);
      const finalHTMLFixed = formatTime(0, true);

      normalTimer.innerHTML = finalHTMLNormal;
      fixedTimer.innerHTML = finalHTMLFixed;
      const ofertaDiv = document.querySelector('.menu-oferta-aovivo');
      if (ofertaDiv) {
        ofertaDiv.remove();
      }

      return;
    }


    const seventyTwoHoursInSeconds = 72 * 3600;

    const newHTMLNormal = totalSeconds > seventyTwoHoursInSeconds
      ? formatFullTime(totalSeconds, false)
      : formatTime(totalSeconds, false);

    const newHTMLFixed = totalSeconds > seventyTwoHoursInSeconds
      ? formatFullTime(totalSeconds, true)
      : formatTime(totalSeconds, true);

    if (normalTimer.innerHTML !== newHTMLNormal) {
      normalTimer.innerHTML = newHTMLNormal;
    }

    if (fixedTimer.innerHTML !== newHTMLFixed) {
      fixedTimer.innerHTML = newHTMLFixed;
    }

    const label = document.getElementById('labelTerminaAovivo');
    if (label) {
      const twoHoursInSeconds = 2 * 3600;
      label.textContent = totalSeconds > twoHoursInSeconds ? 'TERMINA EM:' : 'ESTÁ TERMINANDO:';
    }

    normalTimer.style.visibility = 'visible';
    fixedTimer.style.visibility = 'visible';
  }

  updateTimer();
  countdown = setInterval(updateTimer, 1000);
}

window.addEventListener('DOMContentLoaded', startCountdown);
