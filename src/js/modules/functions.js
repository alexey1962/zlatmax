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
if(spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter(function(item) {
        return !item.dataset.spollers.split(",")[0]
    })

    if(spollersRegular.length > 0) {
        initSpollers(spollersRegular)
    }

    const spollersMedia = Array.from(spollersArray).filter(function (item) {
        return item.dataset.spollers.split(",")[0]
    })

    //спойлеры с медиазапросами
    if(spollersMedia.length > 0) {
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

        let mediaQueries = breakpointsArray.map(function(item) {
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type
        })
        mediaQueries = mediaQueries.filter(function(item, index, self) {
            return self.indexOf(item) === index
        })

        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",")
            const mediaBreakpoint = paramsArray[1]
            const mediaType = paramsArray[2]
            const matchMedia = window.matchMedia(paramsArray[0])

            const spollerArray = breakpointsArray.filter(function (item) {
                if(item.value === mediaBreakpoint && item.type === mediaType) {
                    return true
                }
            })
        })

        matchMedia.addListener(function() {
            initSpollers(spollersArray, matchMedia)
        })
        initSpollers(spollersArray, matchMedia)
    }
}

function initSpollers(spollersArray, matchMedia = false) {
    spollersArray.forEach(spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock
        if(matchMedia.matches || !matchMedia) {
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
    if(spollerTitles.length > 0) {
        spollerTitles.forEach(spollerTitle => {
            if(hideSpollerBody) {
                spollerTitle.removeAttribute('tabindex')
                if(!spollerTitle.classList.contains('_active')) {
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
    if(el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
        const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]')
        const spollersBlock = spollerTitle.closest('[data-spollers]')
        const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false
        if(!spollersBlock.querySelectorAll('._slide').length) {
            if(oneSpoller && !spollerTitle.classList.contains('_active')) {
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
    if(spollerActiveTitle) {
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
        if(target.hidden) {
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
    if(target.hidden) {
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

if(popupLinks.length > 0) {
    for(let i = 0; i < popupLinks.length; i++) {
        const popupLink = popupLinks[i]
        popupLink.addEventListener('click', function(e) {
            const popupName = popupLink.getAttribute('href').replace('#', '')
            const curentPopup = document.getElementById(popupName)
            popupOpen(curentPopup)
            e.preventDefault()
        })
    }
}

const popupCloseIcon = document.querySelectorAll('.close-popup')
if(popupCloseIcon.length > 0) {
    for(let i = 0; i < popupCloseIcon.length; i++) {
        const el = popupCloseIcon[i]
        el.addEventListener('click', function(e) {
            popupClose(el.closest('.popup'))
            e.preventDefault()
        })
    }
}

function popupOpen(curentPopup) {
    if(curentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open')
        if(popupActive) {
            popupClose(popupActive, false)
        } else {
            bodyLock()
        }
        curentPopup.classList.add('open')
        curentPopup.addEventListener('click', function(e) {
            if(!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'))
            }
        })
    }
}

function popupClose(popupActive, doUnlock = true) {
    if(unlock) {
        popupActive.classList.remove('open')
        if(doUnlock) {
            bodyUnlock()
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px'
    
    if(lockPadding.length > 0) {
        for(let i = 0; i < lockPadding.length; i++) {
            const el = lockPadding[i]
            el.style.paddingRight = lockPaddingValue
        }  
    }
    
    body.style.paddingRight = lockPaddingValue
    body.classList.add('lock')

    unlock = false
    setTimeout(function() {
        unlock = true
    }, timeout)
}

function bodyUnlock() {
    setTimeout(function() {
        if(lockPadding.length > 0) {
            for(let i = 0; i < lockPadding.length; i++) {
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

document.addEventListener('keydown', function(e) {
    if(e.which === 27) {
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

export function dynamicAdapt() {
let originalPositions = []
let daElements = document.querySelectorAll('[data-da]')
let daElementsArray = []
let daMatchMedia = []

if(daElements.length > 0) {
    let number = 0
    for(let i = 0; i < daElements.length; i++) {
        const daElement = daElements[i]
        const daMove = daElement.getAttribute('data-da')
        const daArray = daMove.split(',')
        if(daArray.length == 3) {
            daElement.setAttribute('data-da-index', number)
            originalPositions[number] = {
                "parent": daElement.parentNode,
                "index": indexInParent(daElement)
            }
                daElementsArray[number] = {
                "element": daElement,
                "destination": document.querySelector('.' + daArray[0].trim()),
                "place": daArray[1].trim(),
                "breakpoint": daArray[2].trim()
                }
                number++
        }
    }
    dynamicAdaptSort(daElementsArray)

    for(let i = 0; i < daElementsArray.length; i++) {
        const elem = daElementsArray[i]
        const daBreakpoint = elem.breakpoint
        const daType = "max"
        
        daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"))
        daMatchMedia[i].addListener(dynamicAdapt)
    }
}

function dynamicAdapt(e) {
    for(let i = 0; i < daElementsArray.length; i++) {
        const elem = daElementsArray[i]
        const daElement = elem.element
        const daDestination = elem.destination
        const daPlace = elem.place
        const daBreakpoint = elem.breakpoint
        const daClassname = "dynamicAdapt" + daBreakpoint

        if(daMatchMedia[i].matches) {
            if(!daElement.classList.contains(daClassname)) {
                let actualIndex
                if(daPlace == 'first') {
                    actualIndex = indexOfElements(daDestination)[0]
                } else if(daPlace == 'last') {
                    actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length]
                } else {
                    actualIndex = indexOfElements(daDestination)[daPlace]
                }
                daDestination.insertBefore(daElement, daDestination.children[actualIndex])
                daElement.classList.add(daClassname)
            }
        } else {
            if(daElement.classList.contains(daClassname)) {
                dynamicAdaptBack(daElement)
                daElement.classList.remove(daClassname)
            }
        }
    }
    customAdapt()
}

dynamicAdapt()

function dynamicAdaptBack(elem) {
    const daIndex = elem.getAttribute('data-da-index')
    const originalPlace = originalPositions[daIndex]
    const parentPlace = originalPlace['parent']
    const indexPlace = originalPlace['index']
    const actualIndex = indexOfElements(parentPlace, true)[indexPlace]
    parentPlace.insertBefore(elem, parentPlace.children[actualIndex])
}
function indexInParent(elem) {
    let children = Array.prototype.slice.call(elem.parentNode.children)
    return children.indexOf(elem)
}
function indexOfElements(parent, back) {
    const children = parent.children
    const childrenArray = []

    for (let i = 0; i < children.length; i++) {
        const childrenElement = children[i]
        if(back) {
            childrenArray.push(i)
        } else {
            if(childrenElement.getAttribute('data-da') == null) {
                childrenArray.push(i)
            }
        }
    }
    return childrenArray
}

function dynamicAdaptSort(arr) {
    arr.sort(function (a,b) {
        if(a.breakpoint > b.breakpoint) {return -1} else {return 1}
    })
    arr.sort(function (a,b) {
        if (a.place > b.place) { return 1 } else { return -1 }
    })
}

function customAdapt() {
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
}
}