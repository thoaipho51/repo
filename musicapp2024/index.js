const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const USER_KEY = 'SOUP_KEY'

const cd =$('.cd')
const cd_thumb =$('.cd-thumb')
const list_song =$('.list-song')


const playbtn = $('.btn-toggle-play')
const nextbtn = $('.btn-next')
const prevbtn = $('.btn-prev')
const randombtn = $('.btn-random')
const repeatbtn = $('.btn-repeat')

const audio = $('#audio-song')
const progress = $('.progress')
const header_name = $('.mp3-song-name')
const playControl = $('.app')

const app = {

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config:JSON.parse(localStorage.getItem(USER_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(USER_KEY, JSON.stringify(this.config))
    },
    songs:  [
        {
            name: 'Cắt đôi nỗi sầu',
            singer: 'Tăng Duy Tân',
            path: './src/catdoinoisau.mp3',
            img: './src/catdoinoisau.jpg'
        },
        {
            name: 'Thương ly biệt',
            singer: ' Chu Thúy Quỳnh - (Official Music Video)',
            path: './src/thuonglybiet.mp3',
            img: './src/thuonglybiet.jpg'
        },
        {
            name: 'Chúng ta không thuộc về nhau',
            singer: 'Sơn Tùng M-TP - Official Music Video',
            path: './src/chungtakhongthuocvenhau.mp3',
            img: './src/chungtakhongthuocvenhau.jpg'
        },
        {
            name: 'Liên khúc nhạc xuân',
            singer: 'Nhạc sĩ: Bảo Chấn, Ngọc Châu',
            path: 'https://c1-ex-swe.nixcdn.com/NhacCuaTui994/LienKhucHoaCoThiThamMuaXuan-ThuMinh-6201043.mp3?st=LJBmxLO6kdbAIxHNJnaAyQ&e=1704692635&download=true',
            img: 'https://avatar-ex-swe.nixcdn.com/playlist/2021/12/29/3/f/b/1/1640767274835_500.jpg'
        },
       
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <li class="song ${index === this.currentIndex ? 'active': ''}" data-index = ${index}>
                <div class="disk" style= "background-image: url('${song.img}')"></div>
                <div class="song-content">
                    <h4>${song.name}</h4>
                    <h5>${song.singer}</h5>
                </div>
                <div class="song-more">
                    <i class="fas fa-ellipsis-h"> </i>
                </div>
            </li>
            `
        })
        list_song.innerHTML = htmls.join('');
    },
    handleEvents: function () {
        const _this = this;
        // const cdWidth = cd.offsetWidth -1697
        // //Phóng to thu nhỏ
        // list_song.addEventListener('scroll', function(){
            
        //     const scrollTop = list_song.scrollTop
        //     const newWidth = cdWidth - scrollTop
        //     cd.style.width = newWidth + 'px';
        // });

        //Xử lý quay CD
        const cdAnimate = cd_thumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdAnimate.pause()



        playbtn.onclick = function () {
            if(_this.isPlaying){
                audio.pause() 
            }else{
                audio.play() 
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true
            playControl.classList.add('playing')
            cdAnimate.play()

        }
        audio.onpause = function () {
            _this.isPlaying = false
            playControl.classList.remove('playing')
            cdAnimate.pause()
            
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if (audio.duration) {
                const proressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = proressPercent
            }
        }
        //Xử lý tua
        progress.onchange = function(e){
            //50 * 114 /100
            const seekTime = e.target.value * audio.duration / 100 
            audio.currentTime = seekTime
            _this.setConfig('seektime', seekTime)
        }
        
        nextbtn.onclick = function () {
            
            if (_this.isRandom) {
                _this.nextRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Xử lý prev bài hát
        prevbtn.onclick = function () {
            if (_this.isRandom) {
                _this.nextRandomSong()
            }else{
                _this.prevSong()
            }
            
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //xử lý next bài khi end
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            }else{
                nextbtn.click()
            }
        }

        //Xử lý nút random
        randombtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randombtn.classList.toggle('active', _this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
        }

        //Xử lý nút repeat bài
        repeatbtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatbtn.classList.toggle('active', _this.isRepeat)
            _this.setConfig('isRepeat', _this.isRepeat)
        }

        //Xử lý click bài trong playlist # bắt sự kiện click phần tử
        list_song.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active')
            const moreNode = e.target.closest('.song-more')
            if (songNode || moreNode) {
                //Xử lý song
                if(songNode && !moreNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadSong(_this.currentIndex)
                }

                // Xử lý more
                if (e.target.closest('.song-more')) {
                    console.log('more');
                }
            }
        }
        
    },
    defineProperty: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })

        Object.defineProperty(this, 'loadSong', {
            get: function ()  {
                return function (songIndex) {
                    this.currentIndex = songIndex;
                    console.log('Đang phát:' + this.songs[this.currentIndex].name);
                    this.setConfig('currentSong', this.currentIndex)
                    this.loadCurrentSong();
                    audio.play();
                    this.render();
                    this.scrollToActiveSong()
                }// Đảm bảo rằng 'this' trong hàm trả về chính là đối tượng hiện tại
            }
        });
    },
    scrollToActiveSong: function () {
        setTimeout(()=> {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 350)
    },
    loadCurrentSong: function() {
        header_name.textContent = this.currentSong.name
        cd_thumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function(){
        // this.currentIndex = 
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        if(this.config.currentSong){
            this.currentIndex = this.config.currentSong
        }
        // if(this.config.seektime){
        //     audio.currentTime = this.config.seektime
        // }

        repeatbtn.classList.toggle('active', this.isRepeat)
        randombtn.classList.toggle('active', this.isRandom)
    },
    nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.setConfig('currentSong', this.currentIndex)
        this.loadCurrentSong()
    },
    nextRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)

        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex
        this.setConfig('currentSong', this.currentIndex)
        this.loadCurrentSong()
        
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.setConfig('currentSong', this.currentIndex)
        this.loadCurrentSong()
    },
    start: function(){
        //gán cấu hình từ local vào app
        this.loadConfig()
        // Định nghĩa thuộc tính cho object
        this.defineProperty()

        //Lắng nghe sự kiện
        this.handleEvents()
        //load song đầu tiên
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}
app.start()