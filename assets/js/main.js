const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const  headingTitle = $('.title')
const listSong = $('.list-music')
const singerName = $('.album-title')
const songTime = $('.album-time')
const songImg = $('.album-image')
const audio = $('#audio')
const btnPlay = $('.btn-play')
const btnPause = $('.btn-pause')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-pre')
const btnRandom = $('.btn-random')
const btnReload = $('.btn-reload')


const app = {
    currenIndex: 0,
    randomActive: false,
    repeatActive: false,
    songs: [
        {
          name: "Bất Quá Nhân Gian",
          singer: "Chu Thuý Quỳnh",
          path: "/assets/music/batquanhangian_chuthuyquynh.mp3",
          image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_webp/avatars/c/a/3/0/ca304ae8ec687e4b0ed96515b186577b.jpg"
        },
        {
          name: "Tay Trái Chỉ Trăng",
          singer: "Chu Thuý Quỳnh",
          path: "/assets/music/taytraichitrang_chuthuyquynh.mp3",
          image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_webp/avatars/c/a/3/0/ca304ae8ec687e4b0ed96515b186577b.jpg"
        },
        {
          name: "Đại Thiên Bồng",
          singer: "Chu Thuý Quỳnh",
          path: "/assets/music/daithienbong_chuthuyquynh.mp3",
          image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_webp/avatars/c/a/3/0/ca304ae8ec687e4b0ed96515b186577b.jpg"
        },
        {
            name: "Ai Chung Tình Được Mãi",
            singer: "Đinh Tùng Huy",
            path: "/assets/music/AiChungTinhDuocMai-DinhTungHuy.mp3",
            image: "https://data.chiasenhac.com/data/cover/151/150118.jpg"
        },
        {
            name: "Hoa Hải Đường",
            singer: "Jack",
            path: "/assets/music/Hoa Hai Duong - Jack.mp3",
            image: "https://data.chiasenhac.com/data/cover/128/127858.jpg"
        },
        {
            name: "Đế Vương",
            singer: "Đình Dũng",
            path: "/assets/music/De Vuong - Dinh Dung_ ACV.mp3",
            image: "https://data.chiasenhac.com/data/cover/151/150745.jpg"
        },
      ],
    render: function() {
        const htmls = this.songs.map(function(song, index) {
            return `
            <li class="list-item-music ${index === app.currenIndex ? 'active': ''}" data-index="${index}">
                <h4 class="name-song">${song.name}</h4>
            </li>
            `;
        })
        listSong.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        // Define ra current song tự bắt bài hát hiện tại dựa vào chỉ mục 
        Object.defineProperty(this, 'currentSong', {
            get: function() {
               return this.songs[this.currenIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this

        //Xử lý CD quay
        const CD = songImg.animate([
            {
                transform: 'rotate(360deg)' }
        ], { 
            duration: 10000, //10s
            iterations: Infinity
        })
        CD.pause()


        //Xử lý Play
        btnPlay.onclick = function() {

            audio.play()
            btnPlay.classList.add('active')
            btnPause.classList.remove('active')
            CD.play()            
        }

        //Xử lý Pause
        btnPause.onclick = function() {
            audio.pause()
            btnPlay.classList.remove('active')
            btnPause.classList.add('active')
            CD.pause()
        }

        //Xử Lý tiến độ bài hát khi bài hát được chạy
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressSong = Math.floor(audio.currentTime/audio.duration * 100)
                progress.value = progressSong
            }
            songTime.textContent = Math.floor(audio.currentTime)
        }

        //Xử lý tua (Quy đổi phần trăm thanh progress quy đổi thành số giây)
        progress.onchange = function(e) {
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
        }

        //Xử lý next
        btnNext.onclick = function() {
            if (_this.randomActive) {
                _this.randomSong()
            }else {
                _this.nextSong()
                btnPlay.classList.add('active')
                btnPause.classList.remove('active')
            }
            audio.play()
            CD.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Xử lý Pre
        btnPrev.onclick = function() {
            if (_this.randomActive) {
                _this.randomSong()
            }else {
                _this.prevSong()
                btnPlay.classList.add('active')
                btnPause.classList.remove('active')
            }
            
            audio.play()
            CD.play()
            _this.render()
            _this.scrollToActiveSong()

        }

        // Khi bấm nút random (Bật tắt random)
        btnRandom.onclick = function() {
            _this.randomActive = !_this.randomActive
            btnRandom.classList.toggle('active', _this.randomActive)
        }

        //Xử lý nút lặp bài hát
        btnReload.onclick = function(e) {
            _this.repeatActive = !_this.repeatActive

            btnReload.classList.toggle('active', _this.repeatActive)
        }

        //Xử lý kết thúc bài hát
        audio.onended = function() {
            if(_this.repeatActive){
                audio.play()
            }else{
                btnNext.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        // !!!
        listSong.onclick = function(e) {
            const songNode = e.target.closest('.list-item-music:not(.active)')
            if (songNode) {
                _this.currenIndex = Number(songNode.dataset.index)
                _this.loadcurrentSong()
                _this.render()

                btnPlay.classList.add('active')
                btnPause.classList.remove('active')
                audio.play()
                CD.play()

                // $('.list-item-music.active').classList.remove('active')
                // songNode.classList.add('active')
                
            }
        }


    },
    loadcurrentSong: function() {

        headingTitle.textContent = this.currentSong.name
        singerName.textContent = this.currentSong.singer
        songImg.src = this.currentSong.image
        audio.src = this.currentSong.path

    },
    nextSong: function() {
        this.currenIndex ++
        if (this.currenIndex >= this.songs.length) {
            this.currenIndex = 0
        }
        this.loadcurrentSong()
    },
    prevSong: function() {
        this.currenIndex--
        if (this.currenIndex < 0) {
            this.currenIndex = this.songs.length - 1
        }
        this.loadcurrentSong()
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currenIndex);

        this.currenIndex = newIndex
        this.loadcurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.list-item-music.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 500)
    },
    start: function(){
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // lắng nghe xử lý các sự kiện
        this.handleEvent()

        //Tải thông tin bài hát vào ui
        this.loadcurrentSong()


        //Render lại ds các bài hát
        this.render()
    }
}

app.start();
