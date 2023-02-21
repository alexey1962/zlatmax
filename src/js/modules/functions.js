import Swiper, { Navigation, Pagination, Autoplay } from "swiper";

export function isWebp() {
  function testWebP(callback) {

    var webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  testWebP(function (support) {

    if (support == true) {
      document.querySelector('body').classList.add('webp');
    } else {
      document.querySelector('body').classList.add('no-webp');
    }
  });
}

export function spollers() {
  const spollersArray = document.querySelectorAll('[data-spollers]')
  if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter(function (item) {
      return !item.dataset.spollers.split(",")[0]
    })

    if (spollersRegular.length > 0) {
      initSpollers(spollersRegular)
    }

    const spollersMedia = Array.from(spollersArray).filter(function (item) {
      return item.dataset.spollers.split(",")[0]
    })

    //спойлеры с медиазапросами
    if (spollersMedia.length > 0) {
      const breakpointsArray = []
      spollersMedia.forEach(item => {
        const params = item.dataset.spollers
        const breakpoint = {}
        const paramsArray = params.split(",")
        breakpoint.value = paramsArray[0]
        breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max"
        breakpoint.item = item
        breakpointsArray.push(breakpoint)
      })

      let mediaQueries = breakpointsArray.map(function (item) {
        return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type
      })
      mediaQueries = mediaQueries.filter(function (item, index, self) {
        return self.indexOf(item) === index
      })


      mediaQueries.forEach(breakpoint => {
        const paramsArray = breakpoint.split(",")
        const mediaBreakpoint = paramsArray[1]
        const mediaType = paramsArray[2]
        const matchMedia = window.matchMedia(paramsArray[0])

        const spollersArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true
          }
        })
        matchMedia.addListener(function () {
          initSpollers(spollersArray, matchMedia)
        })
        initSpollers(spollersArray, matchMedia)
      })



    }
  }

  function initSpollers(spollersArray, matchMedia = false) {
    spollersArray.forEach(spollersBlock => {
      spollersBlock = matchMedia ? spollersBlock.item : spollersBlock
      if (matchMedia.matches || !matchMedia) {
        spollersBlock.classList.add('_init')
        initSpollerBody(spollersBlock)
        spollersBlock.addEventListener('click', setSpollerAction)
      } else {
        spollersBlock.classList.remove('_init')
        initSpollerBody(spollersBlock, false)
        spollersBlock.removeEventListener('click', setSpollerAction)
      }
    })
  }

  function initSpollerBody(spollersBlock, hideSpollerBody = true) {
    const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]')
    if (spollerTitles.length > 0) {
      spollerTitles.forEach(spollerTitle => {
        if (hideSpollerBody) {
          spollerTitle.removeAttribute('tabindex')
          if (!spollerTitle.classList.contains('_active')) {
            spollerTitle.nextElementSibling.hidden = true
          }
        } else {
          spollerTitle.setAttribute('tabindex', '-1')
          spollerTitle.nextElementSibling.hidden = false
        }
      })
    }
  }

  function setSpollerAction(e) {
    const el = e.target
    if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
      const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]')
      const spollersBlock = spollerTitle.closest('[data-spollers]')
      const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false
      if (!spollersBlock.querySelectorAll('._slide').length) {
        if (oneSpoller && !spollerTitle.classList.contains('_active')) {
          hideSpollerBody(spollersBlock)
        }
        spollerTitle.classList.toggle('_active')
        _slideToggle(spollerTitle.nextElementSibling, 500)
      }
      e.preventDefault()
    }
  }

  function hideSpollerBody(spollersBlock) {
    const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active')
    if (spollerActiveTitle) {
      spollerActiveTitle.classList.remove('_active')
      _slideUp(spollerActiveTitle.nextElementSibling, 500)
    }
  }

  let _slideUp = (target, duration = 500) => {
    const { paddingTop, paddingBottom } = getComputedStyle(target)
    let height = target.offsetHeight - Number(paddingTop.replace('px', '')) - Number(paddingBottom.replace('px', ''))
    if (!target.classList.contains('_slide')) {
      target.classList.add('_slide')
      target.style.transitionProperty = 'height, margin, padding'
      target.style.transitionDuration = duration + 'ms'
      target.style.height = height + 'px'
      target.offsetHeight
      target.style.overflow = 'hidden'
      target.style.height = 0
      target.style.paddingTop = 0
      target.style.paddingBottom = 0
      target.style.marginTop = 0
      target.style.marginBottom = 0
      window.setTimeout(() => {
        target.hidden = true
        target.style.removeProperty('height')
        target.style.removeProperty('padding-top')
        target.style.removeProperty('padding-bottom')
        target.style.removeProperty('margin-top')
        target.style.removeProperty('margin-bottom')
        target.style.removeProperty('overflow')
        target.style.removeProperty('transition-duration')
        target.style.removeProperty('transition-property')
        target.classList.remove('_slide')
      }, duration)
    }
  }


  let _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
      target.classList.add('_slide')
      if (target.hidden) {
        target.hidden = false
      }
    }
    const { paddingTop, paddingBottom } = getComputedStyle(target)
    let height = target.offsetHeight - Number(paddingTop.replace('px', '')) - Number(paddingBottom.replace('px', ''))
    target.style.overflow = 'hidden'
    target.style.height = 0
    target.style.paddingTop = 0
    target.style.paddingBottom = 0
    target.style.marginTop = 0
    target.style.marginBottom = 0
    target.offsetHeight
    target.style.transitionProperty = 'height, margin, padding'
    target.style.transitionDuration = duration + 'ms'
    target.style.height = height + 'px'
    target.style.removeProperty('padding-top')
    target.style.removeProperty('padding-bottom')
    target.style.removeProperty('margin-top')
    target.style.removeProperty('margin-bottom')
    window.setTimeout(() => {
      target.style.removeProperty('height')
      target.style.removeProperty('overflow')
      target.style.removeProperty('transition-duration')
      target.style.removeProperty('transition-property')
      target.classList.remove('_slide')
    }, duration)
  }

  let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
      return _slideDown(target, duration)
    } else {
      return _slideUp(target, duration)
    }
  }
}

export function initPopups() {
  const popupLinks = document.querySelectorAll('.popup-link')
  const body = document.querySelector('body')
  const lockPadding = document.querySelectorAll('.lock-padding')

  let unlock = true

  const timeout = 800

  if (popupLinks.length > 0) {
    for (let i = 0; i < popupLinks.length; i++) {
      const popupLink = popupLinks[i]
      popupLink.addEventListener('click', function (e) {
        const popupName = popupLink.getAttribute('href').replace('#', '')
        const curentPopup = document.getElementById(popupName)
        popupOpen(curentPopup)
        e.preventDefault()
      })
    }
  }

  const popupCloseIcon = document.querySelectorAll('.close-popup')
  if (popupCloseIcon.length > 0) {
    for (let i = 0; i < popupCloseIcon.length; i++) {
      const el = popupCloseIcon[i]
      el.addEventListener('click', function (e) {
        popupClose(el.closest('.popup'))
        e.preventDefault()
      })
    }
  }

  function popupOpen(curentPopup) {
    if (curentPopup && unlock) {
      const popupActive = document.querySelector('.popup.open')
      if (popupActive) {
        popupClose(popupActive, false)
      } else {
        bodyLock()
      }
      curentPopup.classList.add('open')
      curentPopup.addEventListener('click', function (e) {
        if (!e.target.closest('.popup__content')) {
          popupClose(e.target.closest('.popup'))
        }
      })
    }
  }

  function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
      popupActive.classList.remove('open')
      if (doUnlock) {
        bodyUnlock()
      }
    }
  }

  function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px'

    if (lockPadding.length > 0) {
      for (let i = 0; i < lockPadding.length; i++) {
        const el = lockPadding[i]
        el.style.paddingRight = lockPaddingValue
      }
    }

    body.style.paddingRight = lockPaddingValue
    body.classList.add('lock')

    unlock = false
    setTimeout(function () {
      unlock = true
    }, timeout)
  }

  function bodyUnlock() {
    setTimeout(function () {
      if (lockPadding.length > 0) {
        for (let i = 0; i < lockPadding.length; i++) {
          const el = lockPadding[i]
          el.style.paddingRight = '0px'
        }
      }

      body.style.paddingRight = '0px'
      body.classList.remove('lock')
    }, timeout)

    unlock = false
    setTimeout(function () {
      unlock = true
    }, timeout)
  }

  document.addEventListener('keydown', function (e) {
    if (e.which === 27) {
      const popupActive = document.querySelector('.popup.open')
      popupClose(popupActive)
    }
  })

  // (function () {
  //     if(!Element.prototype.closest) {
  //         Element.prototype.closest = function(css) {
  //             var node = this
  //             while(node) {
  //                 if(node.matches(css)) return node
  //                 else node = node.parentElement
  //             }
  //             return null
  //         }
  //     }
  // })()

  // (function () {
  //     if(!Element.prototype.matches) {
  //         Element.prototype.matches = Element.prototype.matchesSelector ||
  //             Element.prototype.webkitMatchesSelector ||
  //             Element.prototype.mozMatchesSelector ||
  //             Element.prototype.msMatchesSelector
  //     }
  // })()
}

export function swiper() {
  //https://swiperjs.com/get-started
  function buildSliders() {
    let sliders = document.querySelectorAll('[class*="__swiper"]:not(.swiper-wrapper)')
    if (sliders) {
      sliders.forEach(slider => {
        slider.parentElement.classList.add('swiper')
        slider.classList.add('swiper-wrapper')
        for (const slide of slider.children) {
          slide.classList.add('swiper-slide')
        }
      })
    }
  }

  function initSliders() {
    buildSliders()
    if (document.querySelector('.main-block__slider')) {
      new Swiper('.main-block__slider', {
        modules: [Navigation, Pagination, Autoplay],

        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },

        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 800,
        loop: true,

        pagination: {
          el: '.controll-main-block__dotts',
          clickable: true,
        },

        on: {
          init: function (swiper) {
            const allSliders = document.querySelector('.fraction-controll__all')
            const allSlidesItems = document.querySelectorAll('.slide-main-block:not(.swiper-slide-duplicate)')
            allSliders.innerHTML = allSlidesItems.length < 10 ? `0${allSlidesItems.length}` : allSlidesItems.length
          },
          slideChange: function (swiper) {
            const currentSlide = document.querySelector('.fraction-controll__current')
            currentSlide.innerHTML = swiper.realIndex + 1 < 10 ? `0${swiper.realIndex + 1}` : swiper.realIndex + 1
            console.log(swiper)
          }
        }
      })
    }

    if (document.querySelector('.products-slider')) {
      new Swiper('.products-slider__slider', {
        modules: [Navigation, Pagination, Autoplay],

        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        observer: true,
        observeParents: true,
        slidesPerView: 4,
        watchOverflow: true,
        spaceBetween: 30,
        speed: 800,

        pagination: {
          el: '.products-slider__dotts',
          clickable: true,
          dynamicBullets: true,
        },

        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1370: {
            slidesPerView: 4,
            spaceBetween: 30,
          }
        }
      })
    }

    if (document.querySelector('.products-new')) {
      new Swiper('.products-new__slider', {
        modules: [Navigation, Pagination, Autoplay],

        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },

        observer: true,
        observeParents: true,
        slidesPerView: 3,
        watchOverflow: true,
        spaceBetween: 30,
        speed: 800,

        pagination: {
          el: '.products-new__dotts',
          clickable: true,
          dynamicBullets: true,
        },

        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
            autoHeight: true,
          },
          820: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1330: {
            slidesPerView: 3,
            spaceBetween: 30,
          }
        }
      })
    }

    if (document.querySelector('.article-module')) {
      new Swiper('.article-module__slider', {
        modules: [Navigation, Pagination],

        observer: true,
        observeParents: true,
        slidesPerView: 4,
        watchOverflow: true,
        spaceBetween: 30,
        speed: 800,

        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
            autoHeight: true,
          },
          992: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1300: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1600: {
            slidesPerView: 4,
            spaceBetween: 30,
          }
        }
      })
    }


  }
  function initSlidersScrolls() {
    buildSliders()

    let sliderScrollItems = document.querySelectorAll('.swiper_scroll')
    if (sliderScrollItems.length > 0) {
      for (let i = 0; i < sliderScrollItems.length; i++) {
        const sliderScrollItem = sliderScrollItems[i]
        const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar')
        const sliderScroll = new Swiper(sliderScrollItem, {
          observer: true,
          observeParents: true,
          direction: vertical,
          slidesPreview: 'auto',
          freeMode: {
            enabled: true,
          },

          scrollbar: {
            el: sliderScrollBar,
            draggable: true,
            snapOnRelease: false,
          },
          mousewheel: {
            releaseOnEdges: true,
          },
        })
        sliderScroll.scrollbar.updateSize()
      }
    }
  }
  window.addEventListener('load', function (e) {
    initSliders()
  })
}

export function rating() {
  const ratings = document.querySelectorAll('.rating')
  if (ratings.length > 0) {
    initRatings()
  }

  function initRatings() {
    let ratingActive, ratingValue
    for (let i = 0; i < ratings.length; i++) {
      const rating = ratings[i]
      initRating(rating)
    }
    function initRating(rating) {
      initatingVars(rating)
      setRatingActiveWidth()
      if (rating.classList.contains('rating_set')) {
        setRating(rating)
      }
    }

    function initatingVars(rating) {
      ratingActive = rating.querySelector('.rating__active')
      ratingValue = rating.querySelector('.rating__value')
    }

    function setRatingActiveWidth(i = ratingValue.innerHTML) {
      const ratingActiveWidth = i / 0.05
      ratingActive.style.width = `${ratingActiveWidth}%`
    }

    function setRating(rating) {
      const ratingItems = rating.querySelectorAll('.rating__item')
      for (let i = 0; i < ratingItems.length; i++) {
        const ratingItem = ratingItems[i]
        ratingItem.addEventListener('mouseenter', function (e) {
          initatingVars(rating)
          setRatingActiveWidth(ratingItem.value)
        })
        ratingItem.addEventListener('mouseleave', function (e) {
          setRatingActiveWidth()
        })
        ratingItem.addEventListener('click', function (e) {
          initatingVars(rating)
          ratingValue.innerHTML = i + 1
          setRatingActiveWidth()
        })
      }
    }
  }
}

export function burgerMenu() {
  const iconMenu = document.querySelector('.icon-menu')
  if (iconMenu) {
    const menuBody = document.querySelector('.menu__body')
    iconMenu.addEventListener('click', (e) => {
      document.documentElement.classList.toggle('lock')
      document.documentElement.classList.toggle('menu-open')
      iconMenu.classList.toggle('menu-open')
      menuBody.classList.toggle('menu-open')
      if(document.documentElement.classList.contains('catalog-open')) {
        document.documentElement.classList.remove('catalog-open')
      }
    })
  }
}