import { DISCOUNT_DAY } from '../constant/day';
import { ProductOptions } from './component/ProductOption';
import { ID } from '../constant/id';
import { CLASS } from '../constant/class';
import { PRODUCT_LIST } from '../constant/product';
import { DISCOUNT } from '../constant/discount';
import { CalculateCart } from './component/CalculateCart';
import { StockInfo } from './component/StockInfo';
import { getFlashSaleMessage, getSuggestMessage, MESSAGE } from './util/messageUtil';
import { CartItem } from './component/cartItem';

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

  addBtn.addEventListener('click', function () {
    const selItem = sel.value;
    const itemToAdd = PRODUCT_LIST.find((p) => p.id === selItem);
    if (!itemToAdd || itemToAdd.quantity <= 0) return alert(MESSAGE.OUT_OF_STOCK);

    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        item.querySelector('span').textContent =
          `${itemToAdd.name} - ${itemToAdd.price}\uC6D0 x ${newQty}`;
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

  // 이벤트 타이머는 기존 그대로 유지
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

// function calcCart() {
//   totalAmt = 0;
//   itemCnt = 0;
//   const cartItems = cartDisp.children;
//   let subTot = 0;
//   for (let i = 0; i < cartItems.length; i++) {
//     (function () {
//       let curItem;
//       for (let j = 0; j < PRODUCT_LIST.length; j++) {
//         if (PRODUCT_LIST[j].id === cartItems[i].id) {
//           curItem = PRODUCT_LIST[j];
//           break;
//         }
//       }
//       const q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
//       const itemTot = curItem.price * q;
//       let disc = 0;
//       itemCnt += q;
//       subTot += itemTot;
//       if (q >= 10) {
//         if (curItem.id === 'p1') disc = PRODUCT_DISCOUNTS.p1;
//         else if (curItem.id === 'p2') disc = PRODUCT_DISCOUNTS.p2;
//         else if (curItem.id === 'p3') disc = PRODUCT_DISCOUNTS.p3;
//         else if (curItem.id === 'p4') disc = PRODUCT_DISCOUNTS.p4;
//         else if (curItem.id === 'p5') disc = PRODUCT_DISCOUNTS.p5;
//       }
//       totalAmt += itemTot * (1 - disc);
//     })();
//   }
//   let discRate = 0;
//   if (itemCnt >= 30) {
//     const bulkDisc = totalAmt * NUMBER.BULK_DISCOUNT_RATE;
//     const itemDisc = subTot - totalAmt;
//     if (bulkDisc > itemDisc) {
//       totalAmt = subTot * (1 - NUMBER.BULK_DISCOUNT_RATE);
//       discRate = NUMBER.BULK_DISCOUNT_RATE;
//     } else {
//       discRate = (subTot - totalAmt) / subTot;
//     }
//   } else {
//     discRate = (subTot - totalAmt) / subTot;
//   }
//   if (new Date().getDay() === DISCOUNT_DAY.TUESDAY) {
//     totalAmt *= 1 - NUMBER.DAY_DISCOUNT_RATE;
//     discRate = Math.max(discRate, NUMBER.DAY_DISCOUNT_RATE);
//   }
//   sum.textContent = '총액: ' + Math.round(totalAmt) + '원';
//   if (discRate > 0) {
//     const span = document.createElement('span');
//     span.className = 'text-green-500 ml-2';
//     span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
//     sum.appendChild(span);
//   }
//   updateStockInfo();
//   renderBonusPts();
// }

// function main() {
//   const root = document.getElementById('app');
//   const cont = document.createElement('div');
//   const wrap = document.createElement('div');
//   const hTxt = document.createElement('h1');
//   cartDisp = document.createElement('div');
//   sum = document.createElement('div');
//   sel = document.createElement('select');
//   addBtn = document.createElement('button');
//   stockInfo = document.createElement('div');

//   cartDisp.id = ID.CART_ITEMS;
//   sum.id = ID.CART_TOTAL;
//   sel.id = ID.PRODUCT_SELECT;
//   addBtn.id = ID.ADD_TO_CART_BUTTON;
//   stockInfo.id = ID.STOCK_STATUS;

//   cont.className = CLASS.CONTAINER;
//   wrap.className = CLASS.WRAPPER;
//   hTxt.className = CLASS.HEADING;
//   sum.className = CLASS.TOTAL;
//   sel.className = CLASS.SELECT;
//   addBtn.className = CLASS.BUTTON;
//   stockInfo.className = CLASS.STOCK_MSG;

//   hTxt.textContent = '장바구니';
//   addBtn.textContent = '추가';

//   updateSelOpts();

//   wrap.appendChild(hTxt);
//   wrap.appendChild(cartDisp);
//   wrap.appendChild(sum);
//   wrap.appendChild(sel);
//   wrap.appendChild(addBtn);
//   wrap.appendChild(stockInfo);
//   cont.appendChild(wrap);
//   root.appendChild(cont);

//   calcCart();

//   setTimeout(function () {
//     setInterval(function () {
//       const luckyItem = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
//       if (Math.random() < NUMBER.FLASH_SALE_PROBABILITY && luckyItem.quantity > 0) {
//         luckyItem.price = Math.round(luckyItem.price * (1 - NUMBER.FLASH_SALE_DISCOUNT_RATE));
//         alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
//         updateSelOpts();
//       }
//     }, 30000);
//   }, Math.random() * 10000);

//   setTimeout(function () {
//     setInterval(function () {
//       if (lastSel) {
//         const suggest = PRODUCT_LIST.find(function (item) {
//           return item.id !== lastSel && item.quantity > 0;
//         });
//         if (suggest) {
//           alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
//           suggest.price = Math.round(suggest.price * (1 - NUMBER.SUGGESTION_DISCOUNT_RATE));
//           updateSelOpts();
//         }
//       }
//     }, 60000);
//   }, Math.random() * 20000);
// }

main();

// addBtn.addEventListener('click', function () {
//   const selItem = sel.value;
//   const itemToAdd = PRODUCT_LIST.find(function (p) {
//     return p.id === selItem;
//   });
//   if (itemToAdd && itemToAdd.quantity > 0) {
//     const item = document.getElementById(itemToAdd.id);
//     if (item) {
//       const newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
//       if (newQty <= itemToAdd.quantity) {
//         item.querySelector('span').textContent =
//           itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
//         itemToAdd.quantity--;
//       } else {
//         alert('재고가 부족합니다.');
//       }
//     } else {
//       const newItem = document.createElement('div');
//       newItem.id = itemToAdd.id;
//       newItem.className = 'flex justify-between items-center mb-2';
//       newItem.innerHTML =
//         '<span>' +
//         itemToAdd.name +
//         ' - ' +
//         itemToAdd.price +
//         '원 x 1</span><div>' +
//         '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
//         itemToAdd.id +
//         '" data-change="-1">-</button>' +
//         '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
//         itemToAdd.id +
//         '" data-change="1">+</button>' +
//         '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
//         itemToAdd.id +
//         '">삭제</button></div>';
//       cartDisp.appendChild(newItem);
//       itemToAdd.quantity--;
//     }
//     calcCart();
//     lastSel = selItem;
//   }
// });

// cartDisp.addEventListener('click', function (event) {
//   const tgt = event.target;
//   if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
//     const prodId = tgt.dataset.productId;
//     const itemElem = document.getElementById(prodId);
//     const prod = PRODUCT_LIST.find(function (p) {
//       return p.id === prodId;
//     });
//     if (tgt.classList.contains('quantity-change')) {
//       const qtyChange = parseInt(tgt.dataset.change);
//       const newQty =
//         parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
//       if (
//         newQty > 0 &&
//         newQty <=
//           prod.quantity + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
//       ) {
//         itemElem.querySelector('span').textContent =
//           itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
//         prod.quantity -= qtyChange;
//       } else if (newQty <= 0) {
//         itemElem.remove();
//         prod.quantity -= qtyChange;
//       } else {
//         alert('재고가 부족합니다.');
//       }
//     } else if (tgt.classList.contains('remove-item')) {
//       const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
//       prod.quantity += remQty;
//       itemElem.remove();
//     }
//     calcCart();
//   }
// });
