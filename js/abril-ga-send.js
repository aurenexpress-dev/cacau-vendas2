let method_customData = "undefined" !== typeof customData ? customData["method-ga-gtag"] : "gtag";

function ga4EventAction(category, action) {
    let event_name = category;
    if ("podcasts-eng" === category) {
        event_label = action;
        label = action;
        event_name = "podcasts_eng";
    } else {
        if ("" !== action) {
            event_name = category + "_" + action;
        }
        event_name = event_name.trimStart().trimEnd().toLowerCase().substring(0, 40);
        event_name = ga4Replace(event_name);
    }
    event_name = event_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return ga4Replace(event_name);
}

function ga4Replace(name){
    return name.replaceAll(" ", "_").replaceAll(" - ", "_").replaceAll("-", "_").replaceAll("__", "_").replaceAll("___", "_");
}

function validObjValue(value, defaultValue) {
    if (value !== undefined) {
        return value;
    }
    return defaultValue;
}

function gaUserProperties(customData){
    gtag("set", "user_properties", customData);
}

function gaSendEvent(...args) {
    dataObj = {};
    let notObj = false;
    if (typeof args[0] === "string") {
        dataObj["metric"] = args[0];
        dataObj["category"] = args[1];
        dataObj["action"] = args[2];
        dataObj["label"] = args[3];
        dataObj["noninteraction"] = validObjValue(args[5], true);

        notObj = true;
    } else {
        dataObj = args[0];
    }
    let brand = validObjValue(dataObj["brand"], "");
    let category = validObjValue(dataObj["category"], "");
    let action = validObjValue(dataObj["action"], "");
    let label = validObjValue(dataObj["label"], "");
    let metric = validObjValue(dataObj["metric"], "");
    let noninteraction = validObjValue(dataObj["noninteraction"], true);
    let send = validObjValue(dataObj["send"], "send");
    let hit_type = validObjValue(dataObj["hit_type"], "event");
    let event_value = validObjValue(dataObj["event_value"], "");
    let cookie_ua = validObjValue(customData["cookie-ua"], "");
    let dimensionsGA4 = validObjValue(dataObj["dimensionsGA4"], {});
    let ga_free = validObjValue(dataObj["ga_free"], false);

    if (typeof customData["method-gtag"] !== "undefined") {
        if (customData["method-gtag"] !== "") {
            if (typeof gtag !== "undefined" && typeof category !== undefined) {
                let event_name = ga4EventAction(category, action);
                let ga4custom = {
                    event_label: label,
                    value: event_value,
                    non_interaction: noninteraction,
                };

                ga4custom["event_category"] = category;
                ga4custom["event_label"] = label;

                if (dimensionsGA4 !== undefined) {
                    Object.keys(dimensionsGA4).forEach((key) => {
                        ga4custom[key] = dimensionsGA4[key];
                    });
                }

                ga4custom["send_to"] = customData["id_ga4"];
                if(ga_free){
                    console.log("==== Evento ga Free");
                    if(
                        typeof customData["id_ga4_free"] !== "undefined" && 
                        customData["id_ga4_free"] !== "" && 
                        customData["id_ga4_free"] != null
                    ){
                        ga4custom["send_to"] = customData["id_ga4_free"];
                        console.log("==== Evento ga Free - disparar");
                    }else{
                        console.log("==== Evento ga Free - Não disparar");
                        return;
                    }
                }

                gtag("event", event_name, ga4custom);
                console.log(`
                    Tipo: 'gtag',
                    Nome: ${event_name},
                    Metrica: ${metric},
                    Categoria: ${category},
                    Ação do evento: ${action},
                    Value: ${event_value},
                    Rótulo do evento: ${label},
                    Não interação: ${noninteraction},
                    GA Free: ${ga_free},
                `);
            }
        }
    }
}

function gaAddToCart(product, id, price, brand, category) {
    if (typeof customData["method-gtag"] !== "undefined") {
        if (customData["method-gtag"] !== "") {
            if (typeof gtag !== "undefined") {
                gtag("event", "add_to_cart", {
                    send_to: customData["id_ga4"],
                    currency: "BRL",
                    value: price,
                    items: [
                        {
                            item_id: id,
                            item_name: product,
                            affiliation: "Abril",
                            index: 0,
                            item_brand: brand,
                            item_category: category,
                            price: price,
                            quantity: 1,
                        },
                    ],
                });

                console.log(`
                    Tipo: 'gtag',
                    Event: add_to_cart,
                    product: ${product},
                    id: ${id},
                    price: ${price},
                    brand: ${brand},
                    category: ${category},
                `);
            }
        }
    }
}

function gaCheckoutOption(checkoutOption) {
    if (typeof customData["method-gtag"] !== "undefined") {
        if (customData["method-gtag"] !== "") {
            if (typeof gtag !== "undefined") {
                gtag("event", "set_checkout_option", {
                    send_to: customData["id_ga4"],
                    checkout_step: 1,
                    checkout_option: "payment_method",
                    value: checkoutOption,
                });

                console.log(`
                    Tipo: 'gtag',
                    Event: gaCheckoutOption,
                    checkoutOption: ${checkoutOption}
                `);
            }
        }
    }
}

function gaPurchase(transactionId, transactionTotal, sku, name, brand, category, pID, tipopag, dimensionsGA4 = {}) {
    if (typeof customData["method-gtag"] !== "undefined") {
        if (customData["method-gtag"] !== "") {
            if (typeof gtag !== "undefined") {
                let ga4custom = {
                    transaction_id: transactionId,
                    value: transactionTotal,
                    tax: 0,
                    shipping: 0,
                    currency: "BRL",
                    coupon: "",
                    items: [
                        {
                            item_id: sku,
                            item_name: name,
                            item_category: category,
                            affiliation: "Abril",
                            coupon: "",
                            discount: 0,
                            item_brand: brand,
                            price: transactionTotal,
                            quantity: 1,
                        },
                    ],
                };

                if (dimensionsGA4 !== undefined) {
                    Object.keys(dimensionsGA4).forEach((key) => {
                        ga4custom[key] = dimensionsGA4[key];
                    });
                }
                ga4custom["send_to"] = customData["id_ga4"];
                gtag("event", "purchase", ga4custom);

                console.log(`
                    Tipo: 'gtag',
                    Event: 'Purchase',
                    transactionId: ${transactionId},
                    transactionTotal: ${transactionTotal},
                    sku: ${sku},
                    name: ${name},
                    brand: ${brand},
                    category: ${category},
                    pID: ${pID},
                    tipo pag: ${tipopag},
                `);
            }
        }
    }

    postPurchaseBigQuery(transactionId, transactionTotal, sku, name, brand, category, pID, tipopag);
    postConversaoAssinaturaBigQuery(transactionId, transactionTotal, sku, brand, category, tipopag);
}
// sku, preco, produto, brand, marca, categoria
function gaProductView() {
    if (typeof customData["method-gtag"] !== "undefined") {
        if (customData["method-gtag"] !== "") {
            if (typeof gtag !== "undefined") {
                let total = 0;
                let itens = {};
                $( ".new-paywall-promotion-container" ).each(function( index ) {
                    let oferta = $( this ).find(".view_item").data("produto");
                    let originString = window.location.href;
                    if( (originString.indexOf("/ofertas/") >= 0 || originString.indexOf("/ofertas") >= 0)){
                        oferta = $( this ).find("h2").text();
                    }
                    if(oferta){
                        let preco = parseFloat($( this ).find(".view_item").data("preco"));
                        let produto = {
                            item_id: $( this ).find(".view_item").data("codprojeto"),
                            item_name: $( this ).find(".view_item").data("produto"),
                            price: preco,
                            index: index,
                            quantity: 1
                        }
                        total = total + preco;
                        itens[index] = produto;
                    }
                });

                // nova tela de oferta
                $( ".oferta-content.active .oferta-prod" ).each(function( index ) {
                    if ($( this ).data('sku_id') !== undefined) {
                        oferta = $( this ).data("sku_oferta");
                        if(oferta.length > 3){
                            let originString = window.location.href;
                            if( (originString.indexOf("/ofertas/") >= 0 || originString.indexOf("/ofertas") >= 0)){
                                oferta = $( this ).find("h3").text();
                            }
                            let preco = parseFloat($( this ).data("sku_preco"));
                            let produto = {
                                item_id: $( this ).data("sku_cod_projeto"),
                                item_name: $( this ).data("sku_oferta"),
                                price: preco,
                                index: index,
                                tipo_contrato_pedido: $('.tabs div.active').text(),
                                quantity: 1
                            }
                            total = total + preco;
                            itens[index] = produto;
                        }
                    }
                });

                const view_item = {
                    currency: "BRL",
                    value: total,
                    items: itens,
                    send_to: customData["id_ga4"]
                };
                gtag("event", "view_item", view_item);
                console.log(`
                    Tipo: 'gtag',
                    Event: 'View_Item'
                `);
                console.log(view_item);
            }
        }
    }
}
let originString = window.location.href;
if( (originString.indexOf("/ofertas/") >= 0 || originString.indexOf("/ofertas") >= 0)){
    if(typeof new_checkout === "undefined"){
        gaProductView();
    }
}

function gaBeginCheckout(sku, preco, produto, brand, marca, categoria) {
    if (typeof customData["method-gtag"] !== "undefined") {
        if (customData["method-gtag"] !== "") {
            if (typeof gtag !== "undefined") {
                gtag("event", "begin_checkout", {
                    send_to: customData["id_ga4"],
                    currency: "BRL",
                    value: preco,
                    items: [
                      {
                        item_id: sku,
                        item_name: produto,
                        affiliation: "Abril",
                        index: 0,
                        item_brand: marca,
                        item_category: categoria,
                        price: preco,
                        quantity: 1
                      }
                    ]
                });
                window.marfeel.cmd.push(['compass', function(compass) {
                    compass.trackConversion('gaBeginCheckout');
                }]);
                console.log(`
                    Tipo: 'gtag',
                    Event: 'gaBeginCheckout',
                    item_category: ${categoria},
                    item_name: ${produto},
                    preco: ${preco},
                    item_id: ${sku},
                    item_brand: ${marca},
                    brand: ${brand}
                `);
            }
        }
    }
}

function postPurchaseBigQuery(transactionId, transactionTotal, sku, name, brand, category, pID, tipopag) {
    let userID = gaGlobal.vid;
    if (AbrilCustomDimension.checkUnicIdGlobal() ) {
        userID = AbrilCustomDimension.getUnicIdGlobal();
    }

    let postUrl = "https://us-central1-abril-id-testes-1528223718961.cloudfunctions.net/navigationData/dados-conversao";
    if ("undefined" !== typeof assine_environment) {
        if (assine_environment[0] == "sandbox") {
            postUrl = "https://us-central1-abril-id-homolog.cloudfunctions.net/navigationData/dados-conversao";
        }
    }

    if (pID == "") {
        pID = 0;
    }
    $.ajax({
        url: postUrl,
        type: "post",
        dataType: "json",
        data: {
            produto: `${name}`,
            sku: `${sku}`,
            categoria: `${category}`,
            marca: `${brand}`,
            valor: `${parseFloat(transactionTotal).toFixed(2)}`,
            tipo_pagamento: `${tipopag}`,
            user_id: `${userID}`,
            post_id: pID,
            transacao_id: `${transactionId}`,
        },
        async: true,
        success: function (data) {
            console.log("Purchase adicionou ao bigQuery");
        },
    });
}

function postConversaoAssinaturaBigQuery(transactionId, transactionTotal, sku, brand, category, tipopag) {
    let userID = gaGlobal.vid;
    if (AbrilCustomDimension.checkUnicIdGlobal() ) {
        userID = AbrilCustomDimension.getUnicIdGlobal();
    }


    let postUrl = "https://us-central1-abril-id-testes-1528223718961.cloudfunctions.net/navigationData/dados-conversao-assinatura";
    if ("undefined" !== typeof assine_environment) {
        if (assine_environment[0] == "sandbox") {
            postUrl = "https://us-central1-abril-id-homolog.cloudfunctions.net/navigationData/dados-conversao-assinatura";
        }
    }
    var oferta = $("body").attr("data-oferta");
    var parcelas = $(".optsel").attr("data-numparcelas");
    let quebra = category.split("/");
    var tipo_assinatura = quebra[1];
    var tipo_plano = quebra[0];

    if ($('#checkout_ticket').val() !== ''){
        if($('.optsel').attr('data-voucher') > 0){
            oferta = $(".optsel").data("voucher_codcampanha");
        }else{
            oferta =  $('#dataVoucher').attr('data-dscoferta');
            parcelas = 0;
        }
    }

    if(tipopag === 'Google Swg'){
        parcelas = 1;
        sku = $(".btn-offer-google").data("swgSku");
        oferta = $(".btn-offer-google").data("swgSku");
    }
    if(tipopag === 'PayPal'){
        let formDataPaypal = JSON.parse(localStorage.getItem('abril_data_sel'));
        oferta = formDataPaypal["data-ofertaafiliado"];
        sku = formDataPaypal["data-planoafiliado"];
        if(formDataPaypal["data-voucher"] > 0){
            oferta = formDataPaypal["data-voucher_codcampanha"];
            sku = formDataPaypal["data-voucher_codplano"];
        }

    }
    if(tipopag === 'Voucher 100%'){
        oferta = $("#dataVoucher").data("dscoferta");
        sku = $("#dataVoucher").data("codplano");
        tipo_plano = $("#dataVoucher").data("contrato");
        parcelas = 0;
    }

    let postData = {
        user_id : `${userID}`,
        pedido : `${transactionId}`,
        oferta : `${oferta}`,
        meio_pagamento : `${tipopag}`,
        tipo_assinatura : `${tipo_assinatura}`,
        tipo_plano : `${tipo_plano}`,
        valor : `${transactionTotal}`,
        parcelamento : `${parcelas}`,
        marca : `${brand}`,
        plano : `${sku}`
    }

    $.ajax({
        url: postUrl,
        type: "post",
        dataType: "json",
        data: postData,
        async: true,
        success: function (data) {
            console.log("Conversão Assinatura adicionou ao bigQuery");
        },
    });
}

function gaEventDatalayer(event) {
    if (typeof customData["method-gtag"] !== "undefined") {
        if (customData["method-gtag"] !== "") {
            if (typeof gtag !== "undefined") {
                window.dataLayer = window.dataLayer || [];
                dataLayer.push(event);
                console.log(`
                    Tipo: 'gtag',
                    Event: gaCheckoutOption,
                    event: ${event}
                `);
            }
        }
    }
}

// Função que substitui a validação
// if (typeof ga === 'undefined' || typeof compareMethod === 'undefined' )
// sendo o parâmetro compareMethod opcional e pegando o parâmetro de method dinamicamente
function typeOfMethodCompare(compareMethod, method = method_customData) {
    if (typeof compareMethod !== "undefined") {
        if (typeof customData["method-gtag"] === "undefined" || typeof compareMethod === "undefined") {
            return "undefined";
        }
    } else {
        if (typeof customData["method-gtag"] === "undefined") {
            return "undefined";
        }
    }
}

// Função que substitui a criação estática de instância por dinâmica, geralmente precedida pelo método typeOfMethodCompare
function methodTagConfig(id_gaGtag, cookie_pref, cookie_dom) {
    if (typeof customData["method-gtag"] !== "undefined" && customData["method-gtag"] !=='') {
        gtag("config", id_gaGtag, {
            cookie_prefix: cookie_pref,
            cookie_domain: cookie_dom,
        });
    }
}

/* HELPER */
function isInViewport(el) {
    let isInViewport =
        el.top >= 0 &&
        el.left >= 0 &&
        el.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        el.right <= (window.innerWidth || document.documentElement.clientWidth);
    return isInViewport;
}
