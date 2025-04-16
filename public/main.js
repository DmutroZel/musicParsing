
function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
 }
 
axios.get('http://localhost:3000/music').then((response) => {
  console.log(response.data);
  
  
  
  response.data.forEach((music) => {
    const musicElement = $(`
      <div class="music">
        <h3>${music.title}</h3> 
        <audio src="${music.src}"></audio>
        <div class="custom-player">
          <button class="play-pause">
            <i class="fas fa-play"></i>
          </button>
          <div class="progress-container">
            <div class="progress-bar"></div>
          </div>
          <div class="player-time">0:00 / 0:00</div>
        </div>
      </div>
    `);
    
    $('.musicContainer').append(musicElement);
    
    initPlayer(musicElement);
  });
  
 }).catch(error => {
  console.error('Помилка завантаження:', error);
 });
 
 function initPlayer(el) {
  const audio = el.find('audio')[0];
  const playBtn = el.find('.play-pause');
  const progress = el.find('.progress-container');
  const progressBar = el.find('.progress-bar');
  const timeDisplay = el.find('.player-time');
  
  $(audio).on('loadedmetadata', function() {
    timeDisplay.text(`0:00 / ${formatTime(audio.duration)}`);
  });
  
  playBtn.on('click', function() {
    if (audio.paused) {
      $('audio').not(audio).each(function() {
        this.pause();
        $(this).closest('.music').find('.play-pause i').removeClass('fa-pause').addClass('fa-play');
      });
      
      audio.play();
      $(this).find('i').removeClass('fa-play').addClass('fa-pause');
    } else {
      audio.pause();
      $(this).find('i').removeClass('fa-pause').addClass('fa-play');
    }
  });
  
  $(audio).on('timeupdate', function() {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.css('width', `${percent}%`);
    timeDisplay.text(`${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`);
  });
  
  progress.on('click', function(e) {
    const pos = e.offsetX / $(this).width();
    audio.currentTime = pos * audio.duration;
  });
  
  $(audio).on('ended', function() {
    playBtn.find('i').removeClass('fa-pause').addClass('fa-play');
  });
 }