document.addEventListener('click', documentActions)

const menuBlocks = document.querySelectorAll('.sub-menu-catalog__block')
if(menuBlocks.length) {
    menuBlocks.forEach(menuBlock => {
        const menuBlockItems = menuBlock.querySelectorAll('.sub-menu-catalog__category').length
        menuBlock.classList.add(`sub-menu-catalog__block_${menuBlockItems}`)
    })
}

function documentActions(e) {
    const targetElement = e.target
    if (targetElement.closest('[data-parent]')) {
        const subMenuId = targetElement.dataset.parent ? targetElement.dataset.parent : null
        const subMenu = document.querySelector(`[data-submenu="${subMenuId}"]`)
        const catalogMenu = document.querySelector('.catalog-header')

        if(subMenu) {
            const activeLink = document.querySelector('._sub-menu-active')
            const activeBlock = document.querySelector('._sub-menu-open')

            if(activeLink && activeLink !== targetElement) {
                activeLink.classList.remove('_sub-menu-active')
                activeBlock.classList.remove('_sub-menu-open')
            }
            targetElement.classList.toggle('_sub-menu-active')
            subMenu.classList.toggle('_sub-menu-open')

            
        } else {
            console.log("Ошибка: такого подменю не существует")
        }

        e.preventDefault()
    }
}

const mediaMainBlockTips = document.querySelectorAll('.media-main-block__tip')
for (let MediaTip of mediaMainBlockTips) {
    MediaTip.addEventListener('mouseover', () => {
        MediaTip.style.transition = 'all .3s ease 0s'
        tippy('[data-tippy-content]');
    })
}