// blocks scroll event when full-page scroll animations are in progress
let scroll = 0
// defined so scroll can detect up vs down scrolling
let lastscroll = 0

// jQuery selectors as vars to cut down on function call overhead
let win = $(window)
let hb = $('html, body')
let cv = $('#covvid')
let sd = $('#scrolldown')
let su = $('#scrollup')

win.on('load',_=>{

  // fancy cover animations
  $('body').removeClass('fade')
  sd.css('bottom','-4em').delay(1000).animate({bottom: 0}, 500, _=>{
    sd.addClass('slide')
  })

  // handles full-page scrolling for cover & video
  win.scroll(e=>{
    let height = win.height()
    if(!scroll){

      let top = win.scrollTop()
      let down = top > lastscroll

      // scrolling to/from cover
      // to: fade out + pause vid, make scroll-down caret fixed
      // from: remove fade + play vid, make scroll-down caret absolute
      if(top < height){
        scroll = 1

        if(!down){
          cv.addClass('vidfade')
          sd.removeClass('stick')
          covvid.pause()
        }
        hb.animate({
          scrollTop: $(down ? '#placeholder' : '#cover').offset().top
        }, 300, _=>{
          scroll = 0
          if(down){
            cv.removeClass('vidfade')
            sd.addClass('stick')
            covvid.play()
          }
          lastscroll = win.scrollTop()
        })
      }

      // scrolling to/from video
      // to: play vid
      // from: pause vid
      else if(top < height * 2){
        scroll = 1

        if(!down){
          su.removeClass('stick2')
        }
        hb.animate({
          scrollTop: $(down ? '#stats' : '#placeholder').offset().top
        }, 300, _=>{
          scroll = 0
          if(down){
            covvid.pause()
            su.addClass('stick2')
          } else {
            covvid.play()
          }
          lastscroll = win.scrollTop()
        })
      }
    }
  })

  // scroll-down caret clicked --> scroll 1vw
  sd.click(_=>{
    let top = win.scrollTop()
    win.scrollTop(top + 1).scroll()
  })

  // scroll-up caret clicked --> reset both scroll carets
  su.click(_=>{
    scroll = 1
    cv.addClass('vidfade')

    hb.animate({scrollTop: 0}, {
      duration: 600,
      progress: (_, top)=>{
        if(win.scrollTop() <= win.height() * 2){
          su.removeClass('stick2')
        }
      },
      complete: _=>{
        scroll = 0
        lastscroll = 0
        sd.removeClass('stick slide').css('bottom','-4em').animate({bottom: 0}, 500, _=>{
          sd.addClass('slide')
        })
      }
    })
  })
})

// reset site position for reloads
$(window).on('beforeunload',_=>{
  $(window).scrollTop(0)
})
