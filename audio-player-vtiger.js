//Плеер
function initInsertPlayer() {
    if (!document.getElementById('audio-player')) {
        var str = '\
    <div id="audio-player-list">\
        <div id="audio-player" onselectstart="return false">\
        <input type="hidden" id="audiofile" size="120" value=""/>\
        <audio id="myaudio">HTML5 audio не поддерживается </audio>\
            <p class="control-audio">\
                <i id="play" class="fa fa-2x fa-pause" onclick="playAudio();" disabled></i>\
                <i id="rewind" class="fa fa-2x fa-backward" onclick="rewindAudio();" disabled></i>\
                <i id="forward"  class="fa fa-2x fa-forward" onclick="forwardAudio();" disabled></i>\
                <i id="restart"  class="fa fa-2x fa-refresh" onclick="restartAudio();" disabled></i>\
            </p>\
            <a id="downloadAudio"><i class="buttonDownloadAudio fa fa-2x fa-download"></i></a>\
            <canvas id="canvas" width="500" height="10">Canvas не поддерживается</canvas>\
            <div class="time-audio-duration">\
                <span id="timeAudio"></span> <span id="durationAudio"></span>\
            </div>\
        </div>\
    </div>\
    ';

        var div = document.createElement('div');
        div.innerHTML = str;
        document.body.appendChild(div);
    }
}
var currentFile = "";
var iconPlay = "";
var clickAudio = "";
//отображение и обновление плеера
function progressBar() {
    var oAudio = document.getElementById('myaudio');
    var timeAudio = document.getElementById('timeAudio');
    var durationAudio = document.getElementById('durationAudio');
    //текущее время в секундах
    var elapsedTime = Math.round(oAudio.currentTime);
    var songDurationSecond = secondsTimeSpanToHMS(Math.round(oAudio.duration));
    durationAudio.innerHTML = songDurationSecond;
    if(songDurationSecond == 'NaN:NaN:NaN'){
        durationAudio.innerHTML = '0:00:00';
        timeAudio.innerHTML = '0:00:00' + ' / ';
    }
    //обновление прогресс бара
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        //очистка canvas
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.fillStyle = "#5bc0de";
        var fWidth = (elapsedTime / oAudio.duration) * (canvas.clientWidth);
        //удаление заглушки (загрузка)
        if (fWidth > 0 && document.getElementById('audio-loading')) {
            var audioLoading = document.getElementById('audio-loading');
            audioLoading.remove();
            clickAudio.disabled = false;
        }
        if (fWidth > 0) {
            ctx.fillRect(0, 0, fWidth, canvas.clientHeight);
            var songLengthSecond = secondsTimeSpanToHMS(elapsedTime);
            timeAudio.innerHTML = songLengthSecond + ' / ';
        }
    }
}

//Play and pause
function playAudio(audio) {
    try {
        var oAudio = document.getElementById('myaudio');
        var btn = document.getElementById('play');
        var audioURL = document.getElementById('audiofile');
        var audioPlayer = document.getElementById('audio-player');
        var rightPanel = document.getElementById('rightPanel');
        var audioPlayerWidth = audioPlayer.offsetWidth;
        var audioPlayerHeight = audioPlayer.offsetHeight;
        var rightPanelWidth = rightPanel.offsetWidth;
        if(audio != undefined){
            var iconPlayArray = audio.getElementsByTagName('i');
            iconPlay = iconPlayArray;
        }
        if(iconPlay){
            iconPlay[0].className = (iconPlay[0].className == 'icon-play' ? 'icon-pause' : 'icon-play');
            clickAudio.style.border = '1px solid rgb(122, 216, 244)';
            clickAudio.style.backgroudColor = '#e6feff';
        }
        if(audioPlayerWidth >= 300){
            audioPlayer.style.right = (rightPanelWidth - audioPlayerWidth) / 2  + 'px' ;
        }
        //Пропустить загрузку если файл изменён.
        if (audioURL.value !== currentFile) {
            oAudio.src = audioURL.value;
            currentFile = audioURL.value;
        }
        //Проверка на паузу.
        if (oAudio.paused) {
            oAudio.play();
            //Заглушка (загрузка)
            if(!document.getElementById('audio-loading')){
                function insertAfter(referenceNode, newNode) {
                    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
                }
                var audioLoading = document.createElement("span");
                audioLoading.id = 'audio-loading';
                audioLoading.innerHTML = " \
                    <div class='load'>\
                    <div class='line'></div>\
                    <div class='line'></div>\
                    <div class='line'></div>\
                    <div class='line'></div>\
                    <div class='line'></div>\
                    </div> ";
                audioLoading.style.right = (rightPanelWidth - audioPlayerWidth) / 2  + 'px' ;
                audioLoading.style.width = audioPlayerWidth + 'px';
                audioLoading.style.height = audioPlayerHeight + 'px';
                insertAfter(audioPlayer, audioLoading);
            }
            clickAudio.disabled = true;
        }
        else {
            oAudio.pause();
        }
    }
    catch (e) {
        // F12
        if (window.console && console.error("Error:" + e));
    }
}

//Перемотка на 10 секунд.
function rewindAudio() {
    try {
        var oAudio = document.getElementById('myaudio');
        oAudio.currentTime -= 10.0;
    }
    catch (e) {
        // F12
        if (window.console && console.error("Error:" + e));
    }
}

//Отмотка на 10 секунд.
function forwardAudio() {
    try {
        var oAudio = document.getElementById('myaudio');
        oAudio.currentTime += 10.0;
    }
    catch (e) {
        //F12
        if (window.console && console.error("Error:" + e));
    }
}

//Кнопка рестарта
function restartAudio() {
    try {
        var oAudio = document.getElementById('myaudio');
        oAudio.currentTime = 0;
    }
    catch (e) {
        // F12
        if (window.console && console.error("Error:" + e));
    }
}

//Перевод секунд
function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s / 3600); //Часы
    s -= h * 3600;
    var m = Math.floor(s / 60); //Минуты
    s -= m * 60;
    return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
}

//Добавление событий
function initEvents() {
    var canvas = document.getElementById('canvas');
    var oAudio = document.getElementById('myaudio');

    if(!document.getElementById('audio-player-list')){
        oAudio.addEventListener("playing", function() {
            document.getElementById("play").className = "fa fa-1x fa-pause";
        }, true);

        oAudio.addEventListener("pause", function() {
            document.getElementById("play").className = "fa fa-1x fa-play";
        }, true);
    }

    if(!document.getElementById('audio-player-detail')){
        oAudio.addEventListener("playing", function() {
            document.getElementById("play").className = "fa fa-2x fa-pause";
        }, true);

        oAudio.addEventListener("pause", function() {
            document.getElementById("play").className = "fa fa-2x fa-play";
        }, true);
    }
    //addEventListener на прогресс бар
    oAudio.addEventListener("timeupdate", progressBar, true);
    //клик на позицию аудио
    canvas.addEventListener("click", function(e) {
        var oAudio = document.getElementById('myaudio');
        var canvas = document.getElementById('canvas');

        if (!e) {
            e = window.event;
        }
        try {
            oAudio.currentTime = oAudio.duration * (e.offsetX / canvas.clientWidth);
        }
        catch (err) {
            //F12
            if (window.console && console.error("Error:" + err));
        }
    }, true);
}
//addEventListener на загрузку страницы
window.addEventListener("DOMContentLoaded", initInsertPlayer, false);
if(!document.getElementById('audio-player-list')){
    window.addEventListener("DOMContentLoaded", initInsertJqList, false);
}else{
    initInsertJqList();
}
window.addEventListener("DOMContentLoaded", initEvents, false);

//JQ
function initInsertJqList() {
    if(!document.getElementById('audio-player-detail')){
        var billdurationTime = $('.billduration');
        $(billdurationTime).each(function () {
            var songDurationSecond = secondsTimeSpanToHMS($(this).text());
            $(this).text(songDurationSecond);
        });
        var all_audio = $('.noload');
        all_audio.on("click", function () {
            $('#audio-player').css('display', 'block').animate({bottom: "0"}, 500);
            var audio = this;
            clickAudio = audio;
            $(all_audio).not(audio).find('.icon-pause').removeClass('icon-pause').addClass('icon-play');
            $(all_audio).not(audio).css('border', '1px solid #cccccc').css('background-color', '#f5f5f5');
            var src_audio = this.value;
            document.getElementById('audiofile').value = src_audio;
            document.getElementById('downloadAudio').href = src_audio;
            playAudio(audio);
            var audioRight = $('#audio-player').css('right');
            $('#audio-loading').css('right', audioRight);
            $('#audio-loading').css('display', 'block').animate({bottom: "0"}, 400);
        });

        var tempScrollTop = 0;
        var currentScrollTop = 0;
        $(window).scroll(function () {
            if ($('#audio-player').is(':visible')) {
                currentScrollTop = $(window).scrollTop();
                if (tempScrollTop < currentScrollTop) {//scrolling down
                    if ($(window).scrollTop() > ($(document).height() - $(window).height()) - 1) {
                        $('#audio-player').animate({width: "195px"}, 400);
                        $('#audio-loading').animate({width: "205px"}, 400);
                    }
                }
                else if (tempScrollTop > currentScrollTop) {//scrolling up
                    $('#audio-player').css('width', '900px');
                    $('#audio-loading').css('width', '910px');
                }
                tempScrollTop = currentScrollTop;
            }
        });
    }
    if(!document.getElementById('audio-player-list')){
        var oAudio = document.getElementById('myaudio');
        playAudio();
        var i = 0;
        audioPlayerDetailPause();
        function audioPlayerDetailPause() {
            if(!isNaN(oAudio.duration)){
                $('#audio-loading').css('display', 'none');
                var src_audio = oAudio.src;
                document.getElementById('downloadAudio').href = src_audio;
                playAudio();
            }else if(i <= 70){
                i++;
                setTimeout(audioPlayerDetailPause, 500);
            }
        }
    }
}