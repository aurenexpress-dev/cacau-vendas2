/* SCRIPT ORDENA FILA */
var AbrilScriptsExec = (function () {
  var listFunction = [];
  var directFunction = [];
  var listFunctionInline = [];
  var listFunctionOrder = [];
  let indiceFunction = 0;
  let indiceExec = 0;
  let count_fila = 0;

  function init(){
    console.log("###### INIT FILA ######");
    orderFunctionList();
    console.log(listFunction);

    //execFunction();
    return
  }

  function getFunctionList( func ){
    console.log("+++++++  FILA  ++++++++");
    console.log(listFunction);
    return execFunctionList( func );
  }  

  function verifyFunctionListLoad(){
    console.log("$$$$ VERIFICA ESTADO DA LISTA PARA EXECUCAO $$$$");
    //console.log(listFunctionOrder);
    let loaded = true;
    listFunctionOrder.forEach( obj => {
      //console.log("ESTADO DA FILA " + obj.name + " " + obj.load)
      if( !obj.load ){
        loaded = false;
      }
    } );

    if(!loaded){
      return;
    }
    return execList();
  }  

  function execList( limit = 1 ){
    console.log("+++++++  PROCESSA FILA  ++++++++");
  
    if( count_fila >= limit ){
      console.log("+++++++  COUNT "+ count_fila+"  ++++++++");
      console.log("+++++++  INTERRONPE PROCESSA FILA JA EXECUTADA  ++++++++");
      return;
    }
    console.log(listFunctionOrder);
    listFunctionOrder.forEach( obj => {
      //console.log("+++++++  COUNT "+ count_fila+"  ++++++++");
      if( obj.exec && obj.status == "" && obj.load == true && indiceExec == 0 ){
        console.log("+++++++  EXECUTANDO ITEM DA FILA: "+ obj.name +"  ++++++++");
        indiceExec = 1;
        obj.status = "exec";
        execFunction( obj.name );
        count_fila = count_fila + 1;
      }
    } );
    sendEvent();
    return;
  }  

  function execNextList( limit = 1 ){
    console.log("+++++++  PROCESSA PRÓXIMO DA FILA  ++++++++");
  
    if( count_fila >= limit + 1 ){
      console.log("+++++++  COUNT "+ count_fila+"  ++++++++");
      console.log("+++++++  INTERRONPE PRÓXIMO DA FILA JA EXECUTADA  ++++++++");
      return;
    }
    console.log(listFunctionOrder);
    listFunctionOrder.forEach( obj => {
      //console.log("+++++++  COUNT "+ count_fila+"  ++++++++");
      if( obj.exec && obj.status == "" && obj.load == true  ){
        console.log("+++++++  EXECUTANDO ITEM DA FILA: "+ obj.name +"  ++++++++");
        obj.status = "exec";
        execFunction( obj.name );
        count_fila = count_fila + 1;
      }
    } );
    sendEvent();
    return;
  }    

  function execFunctionList( func ){
    console.log("+++++++  PROCESSA FILA  ++++++++");
    console.log("+++++++  check "+func+"  ++++++++");
    console.log(listFunctionOrder);
    listFunctionOrder.forEach( obj => {
      //console.log(obj.name);
      if( obj.exec && obj.status == ""){
        obj.status = "exec"
        execFunction( obj.name );
      }
    } );
    return;
  }

  function checkExecFunctionList( func ){
    let statusFunc = false;
    listFunctionOrder.every( obj => {
      //console.log(obj.name + " = " + func);
      if( obj.status == "exec" && obj.name == func){
        statusFunc = true;
        console.log("##### STATUS LI 1" );
        return;
      }
      if( obj.status == "exec" && obj.name != func){
        statusFunc = false;
        console.log("##### STATUS LI 2" );
        return;
      }      
      if( obj.status == "" && obj.name != func){
        statusFunc = true;
        console.log("##### STATUS LI 3" );
        return;
      }
    } );
    console.log("##### STATUS LI FINAL " + statusFunc);
    return statusFunc;
  }  

    function checkStatusOnboardingListExec( func ){
    AbrilScriptsExec.showList();
    console.log("# checklist Onboarding " + func );
    let statusFunc = false;
    for (var i = 0; i < listFunctionOrder.length ; i++) {
      if( ( listFunctionOrder[i].status == "" || listFunctionOrder[i].status == "exec" ) && listFunctionOrder[i].name != func){
        break;
      }
      if( ( listFunctionOrder[i].status == "" || listFunctionOrder[i].status == "exec" ) && listFunctionOrder[i].name == func){
        statusFunc = true;
        break;
      }
    }
    console.log("##### STATUS ONBOARDING " + statusFunc);
    return statusFunc;
  } 

  function addFunctionList( obj ){
    listFunction.push(obj);
    orderFunctionList();
    return 
  }

  function addFunctionDirect( obj ){
    directFunction.push(obj);
    return 
  }

  function setLoadStatus( func ){
    console.log("##### FUCNTION CARREGADA " + func + " #########" );
    listFunctionOrder.forEach( obj => {
      if( obj.name == func){
        obj.load = true; 
        console.log("LOAD " + func); 
      }
    } );
    console.log("#### FUCNTION STATUS ATUALIZAO " + func + " #########");
    //console.log(listFunctionOrder);
    return verifyFunctionListLoad();
  }

  function setFuncStatus( func, status ){
    listFunctionOrder.forEach( obj => {
      if( obj.name == func){
        obj.status = status; 
        console.log("EXEC STATUS " + func); 
      }
    } );
    console.log(listFunctionOrder);
    return sendEvent();
  }        

  function removeFunctionList( func ){
    console.log("###### REMOVENDO FUNCTION DA LISTA " + func)
    listFunctionOrder.forEach( obj => {
      //console.log(" REMOVENDO 2 " + func)
      if( obj.name == func && obj.status == ""){
        obj.status = "cancel"
        
      }
    } );
    //console.log(listFunctionOrder);
    return 
  }  

  function orderFunctionList( ){
    listFunctionOrder = listFunction.sort((a,b)=>{
      return  b.ordem - a.ordem;
    })
    listFunctionOrder.reverse();
    //console.log("##### ORDENA FILA #####");
    //console.log(listFunctionOrder);
    return;

  }

  function execFunction( func ){

    return eval( func + "()");
    //return listFunctionOrder.forEach( obj => eval(obj.name + "()") );
  }

  function   createCookieListControl(name){
    var d = '';
    var value = true;
    d = new Date();
    d.setTime( d.getTime() + (1000*60*60*24)) ; 
    expires = "expires="+ d.toUTCString();
    document.cookie = name+"="+value+";" + expires + ";domain=.abril.com.br;path=/";
  }

  function checkCookieListControl(name,func = ""){
      var nameEQ = name + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
          return true;
        }
      }
   
    return false;
  } 

  function eraseCookieList(name) {
    document.cookie =
    name + "=;domain=abril.com.br; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  } 

  function showList(name) {
    return console.log(listFunctionOrder);
  } 

  function sendEvent() {

    if( typeof gaSendEvent == "undefined" ){
      return;
    }

    listFunctionOrder.forEach( obj => {
      if( obj.status == "" ){
        console.log("+++++++  SEND EVENT: "+ obj.label +"  ++++++++");
        /**/
            gaSendEvent({
              "category": "Controle de inibição",
              "action": "Bloqueio de modal",
              "label": obj.label
            });
      }
    } );

    return;
  }   

  function checkDirectExec(func){
    if( directFunction.indexOf(func) != -1 )
      {  
         return true;
      }
      return false;
  }

/*
monta a fila a ser exec com status vazio
ordena fila
carrega arquivos e atualiza status
checa se todos da fila foram carregados
executa fila

*/

  return {
    init: init,
    listFunction: listFunction,
    directFunction: directFunction,
    addFunctionList: addFunctionList,
    addFunctionDirect: addFunctionDirect,
    removeFunctionList: removeFunctionList,
    getFunctionList:getFunctionList,
    execFunction: execFunction,
    execNextList: execNextList,
    setLoadStatus: setLoadStatus,
    createCookieListControl: createCookieListControl,
    checkCookieListControl: checkCookieListControl,
    verifyFunctionListLoad: verifyFunctionListLoad,
    eraseCookieList: eraseCookieList,
    showList: showList,
    setFuncStatus: setFuncStatus,
    checkExecFunctionList: checkExecFunctionList,
    checkStatusOnboardingListExec: checkStatusOnboardingListExec,
    checkDirectExec: checkDirectExec,
  };
})();   

AbrilScriptsExec.init(); 
/* SCRIPT ORDENA FILA */