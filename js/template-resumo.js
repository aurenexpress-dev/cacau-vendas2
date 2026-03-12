const dropdownButton = document.querySelector('.dropdown-resumo');
const lerResumoSpan = document.querySelector('.dropdown-resumo .ler-resumo');
const arrowMain = document.querySelector('.dropdown-button-resumo .arrow');
const resumeList = document.querySelector('.resume-list');
const introText = document.getElementById('intro-text');
const introCompleta = (introText)? introText.innerHTML : '';
const sectionsHeaders = document.querySelectorAll('.section-header');
const curti = document.querySelector('.votar.curti');
const nao_curti = document.querySelector('.votar.nao-curti');
let contarClicks = 0;
let resumoSentEvents = [];

let introOpened = false;
let typingTimeoutId = null;

let timer; // Mova a declaração do timer para fora para que possa ser acessada para limpeza

const printSentence = (element, text, speed = 50, contar) => {
    let index = 0;

    if (element === null) {
        return;
    }

    // Limpa qualquer timer anterior para evitar múltiplas animações simultâneas
    if (timer) {
        clearInterval(timer);
    }

    if (contar) {
        element.innerHTML = text;
        element.classList.remove('typing');
        return;
    }

    const sentence = text;
    element.innerHTML = ''; // Limpa o elemento antes de começar a digitar
    element.classList.add('typing');

    timer = setInterval(function () {
        const char = sentence[index];

        if (char === '<') {
            index = sentence.indexOf('>', index) + 1;
        } else {
            index++;
        }

        element.innerHTML = sentence.slice(0, index);

        if (index === sentence.length) {
            element.classList.remove('typing');
            clearInterval(timer);
        }
    }, speed);
};

if(dropdownButton){
dropdownButton.addEventListener('click', () => {
    eventData ={
        "category": "Summary",
        "action": "Click",
        "label": "Summary"
    }
    resumoEvents(eventData,1);
    document.querySelector('.resumo-abril').classList.toggle('opened');
    const isOpen = resumeList.classList.toggle('open');
    arrowMain.classList.toggle('arrow-up');
    lerResumoSpan.textContent = isOpen ? 'Resumo' : 'Ler Resumo';

    dropdownButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    resumeList.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    
    if (!isOpen) {
        // Se fechar o dropdown, cancela a digitação pendente e limpa
        printSentence(introText, introCompleta, 20, true);
        return;
    }

    if (!introOpened) {
        // Cancelar qualquer digitação pendente e reiniciar do zero
        introOpened = true;
        printSentence(introText, introCompleta, 20, false);
    } else {
        // Já digitou antes, mostra direto
        printSentence(introText, introCompleta, 20, true);
    }
    
});
}


sectionsHeaders.forEach(header => {
    header.addEventListener('click', (event) => {
        eventData ={
            "category": "Topics",
            "action": "Click",
            "label": "Main Topics"
        }
        resumoEvents(eventData,2);
        if (event.target.closest('a.section-toggle')) return;
        const toggleBtn = header.querySelector('.section-button-toggle');

        if (!toggleBtn) return;

        const controls = toggleBtn.getAttribute('aria-controls');
        const subList = document.getElementById(controls);
        if (!subList) return;

        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        const sectionItem = header.closest('.section-item'); // ⬅️ Pega o container pai

        if (expanded) {
            subList.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            subList.setAttribute('aria-hidden', 'true');
            toggleBtn.querySelector('.arrow').classList.remove('arrow-up');
            sectionItem.classList.remove('opened'); // ⬅️ Remove a classe
        } else {
            subList.classList.add('open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            subList.setAttribute('aria-hidden', 'false');
            toggleBtn.querySelector('.arrow').classList.add('arrow-up');
            sectionItem.classList.add('opened'); // ⬅️ Adiciona a classe
        }
    });
});

if(curti){
curti.addEventListener('click', () => {
    eventData ={
            "category": "Rating",
            "action": "Click",
            "label": "Positive"
        }
        resumoEvents(eventData,3);
    const jacurtiu = document.querySelector('.votar.curti.active');
    let nao_curtiu = 'no';
    if (document.querySelector('.votar.nao-curti.active')) {
        nao_curtiu = 'yes';
    }
    
    curti.classList.toggle('active');
    nao_curti.classList.remove('active');
    
    contarCurtir();
    if (jacurtiu) {
        // evento cancelar curtir
        return actionCurtirouDescurtir('desfazer_curti', nao_curtiu);
    }
    return actionCurtirouDescurtir('curti', nao_curtiu);
});
}

if(nao_curti){
nao_curti.addEventListener('click', () => {
    eventData ={
            "category": "Rating",
            "action": "Click",
            "label": "Negative"
        }
        resumoEvents(eventData,4);
    const naojacurtiu = document.querySelector('.votar.nao-curti.active');
    
    let curtiu = 'no';
    if (document.querySelector('.votar.curti.active')) {
        curtiu = 'yes';
    }
    
    nao_curti.classList.toggle('active');
    curti.classList.remove('active');
    
    contarCurtir();
    
    if (naojacurtiu) {
        // evento cancelar não curtir
        return actionCurtirouDescurtir('desfazer_nao_curtir', curtiu);
    }
    return actionCurtirouDescurtir('nao_curtir', curtiu);
});
}
async function actionCurtirouDescurtir(acao, acao_old){
    
    let id = document.querySelector('meta[property="id"]').getAttribute('content');
    
    const myHeaders = new Headers();
    //myHeaders.append("X-WP-Nonce", templateResumoJsObj.nonce);

    const formdata = new FormData();
    formdata.append("action", "resumo_ia_vote");
    formdata.append("_token", templateResumoJsObj.nonce);
    formdata.append("id", id);
    formdata.append("acao", acao);
    formdata.append("acao_old", acao_old);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
    };

    fetch(templateResumoJsObj.ajaxurl, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

}

function contarCurtir(){
    contarClicks++;
    if (contarClicks >= 5) {
        curti.disabled = true;
        nao_curti.disabled = true;
    }
}

function resumoEvents(eventData, eventSend){
    if( resumoSentEvents.indexOf(eventSend) != -1 ){
        return;
    }
    resumoSentEvents.push(eventSend);
    gaSendEvent(eventData);
    return;
}