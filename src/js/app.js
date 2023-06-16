import * as flsFunctions from "./modules/functions.js"

flsFunctions.isWebp()
flsFunctions.spollers()
flsFunctions.initPopups()
flsFunctions.swiper()
flsFunctions.rating()
flsFunctions.burgerMenu()
flsFunctions.rangeInit()
flsFunctions.calculateProduct()
flsFunctions.cart()

import './script.js'

import './modules/mixitup.js'

const deliveryInner = document.querySelector('.delivery__inner');

if (deliveryInner) {
  const mixer = mixitup(deliveryInner, {
    load: {
      filter: '.courier'
    }
  });
}