import { DISCOUNT_DAY } from '../constant/day';
import { ProductOptions } from './component/ProductOption';
import { ID } from '../constant/id';
import { CLASS } from '../constant/class';
import { PRODUCT_LIST } from '../constant/product';
import { DISCOUNT } from '../constant/discount';
import { MESSAGE } from '../constant/message';

import { CalculateCart } from './component/CalculateCart';
import { StockInfo } from './component/StockInfo';
import { getFlashSaleMessage, getSuggestMessage } from './util/messageUtil';
import { CartItem } from './component/CartItem';

let sel, addBtn, cartDisp, sum, stockInfo;
let lastSel,
  totalAmt = 0,
  itemCnt = 0,
  bonusPts = 0;

function updateSelOpts() {
  sel.innerHTML = ProductOptions(PRODUCT_LIST);
}

function calcCart() {
  totalAmt = 0;
  itemCnt = 0;
  const cartItems = cartDisp.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    const curItem = PRODUCT_LIST.find((p) => p.id === cartItems[i].id);
    const q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
    const itemTot = curItem.price * q;
    let disc = 0;
    itemCnt += q;
    subTot += itemTot;
    if (q >= 10) {
      disc =
        {
          p1: 0.1,
          p2: 0.15,
          p3: 0.2,
          p4: 0.05,
          p5: 0.25,
        }[curItem.id] || 0;
    }
    totalAmt += itemTot * (1 - disc);
  }
  let discRate = (subTot - totalAmt) / subTot;
  if (itemCnt >= 30 && totalAmt < subTot * (1 - DISCOUNT.BULK_DISCOUNT_RATE)) {
    totalAmt = subTot * (1 - DISCOUNT.BULK_DISCOUNT_RATE);
    discRate = DISCOUNT.BULK_DISCOUNT_RATE;
  }
  if (new Date().getDay() === DISCOUNT_DAY.TUESDAY) {
    totalAmt *= 1 - DISCOUNT.DAY_DISCOUNT_RATE;
    discRate = Math.max(discRate, DISCOUNT.DAY_DISCOUNT_RATE);
  }
  bonusPts = Math.floor(totalAmt / 1000);
  sum.innerHTML = CalculateCart(totalAmt, discRate, bonusPts);
  stockInfo.textContent = StockInfo(PRODUCT_LIST);
}

function main() {
  const root = document.getElementById('app');
  root.innerHTML = `
    <div class="${CLASS.CONTAINER}">
      <div class="${CLASS.WRAPPER}">
        <h1 class="${CLASS.HEADING}">장바구니</h1>
        <div id="${ID.CART_ITEMS}"></div>
        <div id="${ID.CART_TOTAL}" class="${CLASS.TOTAL}"></div>
        <select id="${ID.PRODUCT_SELECT}" class="${CLASS.SELECT}"></select>
        <button id="${ID.ADD_TO_CART_BUTTON}" class="${CLASS.BUTTON}">추가</button>
        <div id="${ID.STOCK_STATUS}" class="${CLASS.STOCK_MSG}"></div>
      </div>
    </div>
  `;
  cartDisp = document.getElementById(ID.CART_ITEMS);
  sum = document.getElementById(ID.CART_TOTAL);
  sel = document.getElementById(ID.PRODUCT_SELECT);
  addBtn = document.getElementById(ID.ADD_TO_CART_BUTTON);
  stockInfo = document.getElementById(ID.STOCK_STATUS);

  updateSelOpts();
  calcCart();

  // 이벤트 리스너: 장바구니에 추가
  // 물건을 추가하면 재고에서 하나씩 줄이고, 부족할 시 알림창 발생
  addBtn.addEventListener('click', function () {
    const selItem = sel.value;
    const itemToAdd = PRODUCT_LIST.find((p) => p.id === selItem);
    if (!itemToAdd || itemToAdd.quantity <= 0) return alert(MESSAGE.OUT_OF_STOCK);

    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        item.querySelector('span').textContent =
          `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
        itemToAdd.quantity--;
      } else {
        return alert(MESSAGE.OUT_OF_STOCK);
      }
    } else {
      cartDisp.innerHTML += CartItem({ ...itemToAdd, quantity: 1 });
      itemToAdd.quantity--;
    }
    calcCart();
    lastSel = selItem;
  });

  // 이벤트 리스너: 아이템 수량 변경 및 삭제
  // 클릭한 항목의 정보에 맞춰서 수량 변경을 하거나 삭제하고, 재고 초과할 시 알림창 발생
  cartDisp.addEventListener('click', function (event) {
    const tgt = event.target;
    if (!tgt.classList.contains('quantity-change') && !tgt.classList.contains('remove-item'))
      return;

    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = PRODUCT_LIST.find((p) => p.id === prodId);
    const qty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);

    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty = qty + qtyChange;
      if (newQty > 0 && newQty <= prod.quantity + qty) {
        itemElem.querySelector('span').textContent = `${prod.name} - ${prod.price}원 x ${newQty}`;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.quantity -= qtyChange;
      } else {
        return alert(MESSAGE.OUT_OF_STOCK);
      }
    } else {
      prod.quantity += qty;
      itemElem.remove();
    }
    calcCart();
  });

  // 이벤트 타이머: 번개 세일
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
      if (Math.random() < DISCOUNT.FLASH_SALE_PROBABILITY && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * (1 - DISCOUNT.FLASH_SALE_DISCOUNT_RATE));
        alert(getFlashSaleMessage(luckyItem.name));
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 이벤트 타이머: 제안 세일
  setTimeout(() => {
    setInterval(() => {
      if (lastSel) {
        const suggest = PRODUCT_LIST.find((item) => item.id !== lastSel && item.quantity > 0);
        if (suggest) {
          alert(getSuggestMessage(suggest.name));
          suggest.price = Math.round(suggest.price * (1 - DISCOUNT.SUGGESTION_DISCOUNT_RATE));
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

main();
