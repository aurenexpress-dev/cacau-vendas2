$(function() {
  var device = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/"/g, '');
  var podcastPlayer = new window.podcastPlayer(device);
  if ($(".abril-player-podcast").length > 0) {
      podcastPlayer.init();
  }
});

(function(window) {
    'use strict';
    var podcastPlayer = function(device){
        this.device = device || 'desktop';
        this.click_event = device === 'mobile' ? 'touchstart' : 'click';
    };

    podcastPlayer.prototype = {
        init: function() {

            var player_title = document.getElementById('player-title');

            if (this.device === 'mobile' && player_title.innerHTML.length > 53){
                player_title.textContent = player_title.textContent.substring(0,53)+'...';
            }

            var audio = document.getElementById('audio-podcast');
            var brand = document.querySelector("html").className;
            var player_title = document.getElementById('player-title').innerHTML;

            audio.addEventListener('play', playEvent , false);
            audio.addEventListener('timeupdate', updateCurrentTime , false);
            startUpdateProgressBar();

            var player_category = document.getElementById('article-category');

            var total_played = document.getElementById('total-played');
            var progress_bar = document.getElementById('progress-bar');

            progress_bar.addEventListener('mousedown', stopUpdateProgressBar , false);
            progress_bar.addEventListener(this.click_event, seek , false);

            var btn_play = document.getElementById('play');
            btn_play.addEventListener(this.click_event, play , false);

            var btn_pause = document.getElementById('pause');
            btn_pause.addEventListener(this.click_event, pause , false);

            var btn_mute = document.getElementById('mute-unmute');
            btn_mute.addEventListener(this.click_event, muteUnmute , false);

            var btn_goback =  document.getElementById('goback-10');
            btn_goback.addEventListener(this.click_event, goback , false);

            var btn_skip =  document.getElementById('skip-10');
            btn_skip.addEventListener(this.click_event, skip , false);

            var player_spotify =  document.getElementById('player-spotify');
            player_spotify.onclick = function() {
                gaSend(brand, 'podcasts-platforms', brand, 'podcasts-spotify');
            }

            function playEvent(e){
                document.getElementById('current-time').textContent = secToStr( audio.currentTime ) ;
                progress_bar.value = audio.currentTime;
            }

            function updateCurrentTime(){
                document.getElementById('current-time').textContent = secToStr( audio.currentTime);
                document.getElementById('total-time').textContent = secToStr( audio.duration - audio.currentTime );
                if (audio.ended) {
                    gaSend(brand, 'podcasts-eng', 'podcasts-eng-'+player_category.textContent+': '+player_title,'podcasts-eng-100');
                }
            }

            function updateProgressBar(){
                progress_bar.value = audio.currentTime;
                total_played.style.width = (audio.currentTime / audio.duration * 100) + "%";
            }

            function stopUpdateProgressBar(){
                audio.removeEventListener('timeupdate', updateProgressBar , false);
            }

            function startUpdateProgressBar(){
                audio.addEventListener('timeupdate', updateProgressBar , false);
            }

            function seek(e){
                audio.currentTime = progress_bar.value;
                startUpdateProgressBar();
                gaSend(brand, 'podcasts-player', brand,'podcasts-player-seekbar');
            }

            function play(e){
                e.preventDefault();
                audio.play();
                btn_play.style.display = "none";
                btn_pause.style.display = "inline-block";
                gaSend(brand, 'podcasts-player', brand,'podcasts-player-play');
                if (!audio.played.length) {
                    gaSend(brand, 'podcasts-eng','podcasts-eng-'+player_category.innerHTML+': '+player_title,'podcasts-eng-0');
                    gaSend(brand, 'podcasts-platforms', brand, 'podcasts-native');
                }

                window.addEventListener('beforeunload', gaSendClose, false);
            }

            function pause(e){
                e.preventDefault();
                audio.pause();
                btn_pause.style.display = "none";
                btn_play.style.display = "inline-block";
                gaSend(brand, 'podcasts-player', brand,'podcasts-player-pause');

                window.removeEventListener('beforeunload', gaSendClose, false);
            }

            function muteUnmute(e){
                e.preventDefault();
                audio.muted = !audio.muted;
                var muted_state = audio.muted ? 'mute' : 'unmute';
                btn_mute.classList.toggle("muted");
                gaSend(brand, 'podcasts-player', brand,'podcasts-player-'+muted_state);
            }

            function goback(e){
                e.preventDefault();
                stopUpdateProgressBar();
                audio.currentTime = audio.currentTime - 10;
                startUpdateProgressBar();
                gaSend(brand, 'podcasts-player', brand,'podcasts-player-rewind');
            }

            function skip(e){
                e.preventDefault();
                stopUpdateProgressBar();
                audio.currentTime = audio.currentTime + 10;
                startUpdateProgressBar();
                gaSend(brand, 'podcasts-player', brand,'podcasts-player-forward');
            }

            function secToStr( sec_num ) {
                sec_num = Math.floor( sec_num );
                var horas   = Math.floor(sec_num / 3600);
                var minutos = Math.floor((sec_num - (horas * 3600)) / 60);
                var segundos = sec_num - (horas * 3600) - (minutos * 60);
                if (horas   < 10) {horas   = "0"+horas;}
                if (minutos < 10) {minutos = "0"+minutos;}
                if (segundos < 10) {segundos = "0"+segundos;}
                var tempo = minutos+':'+segundos;
                return tempo;
            }

            function gaSend( brand, category, action, label ) {
                if ( typeOfMethodCompare() !== typeof "undefined" ) {

                    gaSendEvent({
                        "brand": brand,
                        "category": category,
                        "action": action,
                        "label": label
                    });

                }
            }

            function gaSendClose( e ) {
                e.preventDefault();
                gaSend(brand, 'podcasts-eng','podcasts-eng-'+player_category.innerHTML+': '+player_title,'podcasts-eng-' + Math.round( audio.currentTime / audio.duration * 100 ) );
                e.returnValue = '';
                return true;
            }
        }
    }
    window.podcastPlayer = podcastPlayer;
})(window);
