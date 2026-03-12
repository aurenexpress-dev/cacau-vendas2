(function() {
    function loadFundingChoicesScript() {
      const script = document.createElement('script');
      script.src = 'https://fundingchoicesmessages.google.com/i/pub-8032989188142109?ers=1';
      script.async = true;
      script.setAttribute('nonce', fcSettings.nonce);
      document.head.appendChild(script);
  
      function signalGooglefcPresent() {
        if (!window.frames['googlefcPresent']) {
          if (document.body) {
            const iframe = document.createElement('iframe');
            iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
            iframe.style.display = 'none';
            iframe.name = 'googlefcPresent';
            document.body.appendChild(iframe);
          } else {
            setTimeout(signalGooglefcPresent, 0);
          }
        }
      }
      signalGooglefcPresent();
    }

    window.loadFundingChoicesScript = loadFundingChoicesScript;
  
    function onFirstScroll() {
      window.removeEventListener('scroll', onFirstScroll);
      if(fcSettings.displayMessage && (null === localStorage.getItem("abrilAssetsUser"))) {
        loadFundingChoicesScript();
      }
      if(typeof wp_paywall_vars !== 'undefined' && !fcSettings.displayMessage && (null === localStorage.getItem("abrilAssetsUser"))){
        if( (wp_paywall_vars.tipo_paywall === "opened") ){
          loadFundingChoicesScript();
        }
      }
    }
  
    window.addEventListener('scroll', onFirstScroll);
  
    window.__fcapi = window.__fcapi || [];
    function displayFundingChoice() {
        window.__fcapi.push(['showChoice', {
            onConsent: function(consentData) {
                console.log('User consent:', consentData);
            },
            onDismiss: function() {
                console.log('Message dismissed');
            }
        }]);
    }
  
    let viewEventTriggered = false;
    window.addEventListener('load', function() {
        if (window.__fcapi && typeof window.__fcapi.push === 'function') {
            displayFundingChoice();
        }

        const observerfc = new MutationObserver(function(mutationsList, observer) {
          for (let mutation of mutationsList) {
              if (mutation.type === 'childList') {
                  const fcRoot = document.querySelector('div.fc-ab-root');
                  if (fcRoot && !viewEventTriggered) {

                      // Evento GA4: view desbloqueio
                      viewEventTriggered = true;
                      gaSendEvent({
                        category: 'adblocking_exibicao',
                        hit_type: 'view',
                      })

                      const whitelistButton = fcRoot.querySelector('.fc-button-whitelist');
                      const subscriptionLink = fcRoot.querySelector('.fc-subscription-link');
                      if (whitelistButton) {
                          whitelistButton.addEventListener('click', function() {
                              // Evento GA4: click desbloqueio
                              gaSendEvent({
                                category: 'adblocking_desbloqueio',
                                hit_type: 'click',
                              })
                          });
                      }
                      if (subscriptionLink) {
                          subscriptionLink.addEventListener('click', function() {
                              // Evento GA4: click oferta
                              gaSendEvent({
                                category: 'adblocking_oferta',
                                hit_type: 'click',
                              })
                          });
                      }
                  }
              }
          }
      });
      observerfc.observe(document.body, { childList: true, subtree: true });

    });
  })();