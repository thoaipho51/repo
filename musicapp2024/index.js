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
            name: 'Buồn Hay Vui',
            singer: 'VSOUL, RPT MCK, Obito, V.A',
            path: 'https://c1-ex-swe.nixcdn.com/Believe_Audio391/BuonHayVuiFeatRptMckObitoRonboogz-VSOULRPTMCKObitoRonboogz-13159599.mp3?st=_vWYSKd-1ohigjbzNp1V5w&e=1704716404&download=true',
            img: 'https://i.ytimg.com/vi/JV0dEgbX5yk/maxresdefault.jpg'
        },
        {
            name: 'Ngày Mai Em Đi Mất',
            singer: 'Khải Đăng - Đạt G',
            path: 'https://c1-ex-swe.nixcdn.com/NhacCuaTui2027/NgayMaiEmDiMat-KhaiDangDatG-7747861.mp3?st=ZQWBT4S6nfD_TZzLjhe4Lw&e=1704716908&download=true',
            img: 'https://geo-media.beatsource.com/image_size/500x500/a/a/b/aab69b0b-224f-4c05-a46a-40e430cae185.jpg'
        },
        {
            name: 'Ngày Đầu Tiên & Anh Sẽ Về Sớm Thôi',
            singer: 'Isaac, Đức Phúc',
            path: 'https://dl30.y2hub.cc/file/zingmp3Z6BZ7WBA128.mp3?fn=Intro%EF%BC%9A%20Ng%C3%A0y%20%C4%90%E1%BA%A7u%20Ti%C3%AAn%20%26%20Anh%20S%E1%BA%BD%20V%E1%BB%81%20S%E1%BB%9Bm%20Th%C3%B4i.mp3',
            img: 'https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/9/f/7/4/9f7452c5bc22716c57e09524824a138f.jpg'
        },
        {
            name: 'Em Ơi Lên Phố',
            singer: 'Minh Vương M4U',
            path: 'https://c1-ex-swe.nixcdn.com/NhacCuaTui991/EmOiLenPho-MinhVuongM4U-6131758.mp3?st=Bcq__xaF0NK_5FIR_sKAzw&e=1704717707&download=true',
            img: 'https://i.ytimg.com/vi/EHASipZkZnk/maxresdefault.jpg'
        },
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
        {
            name: 'Lối Nhỏ',
            singer: 'Đen - Lối Nhỏ ft. Phương Anh Đào (M/V)',
            path: 'https://dl37.y2hub.cc/file/youtubeKKc_RMln5UY128.mp3?fn=%C4%90en%20-%20L%E1%BB%91i%20Nh%E1%BB%8F%20ft.%20Ph%C6%B0%C6%A1ng%20Anh%20%C4%90%C3%A0o%20(M%E2%A7%B8V).mp3',
            img: 'https://i.ytimg.com/vi/KKc_RMln5UY/hqdefault.jpg'
        },
        {
            name: 'Khuất Lối',
            singer: 'H-Kray | Official Lyrics Video',
            path: 'https://dl35.y2hub.cc/file/youtubeG2iaxsilkng320.mp3',
            img: 'https://i.ytimg.com/vi/G2iaxsilkng/sddefault.jpg?sqp=-oaymwEmCIAFEOAD8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgVyhYMA8=&rs=AOn4CLBI1j_tTleQ5ZgXT0FhB60dzCPMpw'
        },
        {
            name: 'NẾU ANH ĐI',
            singer: 'Mỹ Tâm',
            path: 'https://dl34.y2hub.cc/file/youtube00kl9SQxMUM320.mp3?fn=N%E1%BA%BEU%20ANH%20%C4%90I%20-%20M%E1%BB%B8%20T%C3%82M%20%EF%BD%9C%20ANIMATION%20VIDEO.mp3',
            img: 'https://i.ytimg.com/vi/IwxnguWbGy4/maxresdefault.jpg'
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