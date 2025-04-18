import{P as c,M as S,D as l,g as x,a as $}from"./messageUtil-Y7erS81U.js";const h={TUESDAY:2};function D(n){return n.map(t=>{const e=t.quantity===0?"disabled":"";return`<option value="${t.id}" ${e}>${t.name} - ${t.price}원</option>`}).join("")}const i={CART_ITEMS:"cart-items",CART_TOTAL:"cart-total",PRODUCT_SELECT:"product-select",ADD_TO_CART_BUTTON:"add-to-cart",STOCK_STATUS:"stock-status"},u={CONTAINER:"bg-gray-100 p-8",WRAPPER:"max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",HEADING:"text-2xl font-bold mb-4",TOTAL:"text-xl font-bold my-4",SELECT:"border rounded p-2 mr-2",BUTTON:"bg-blue-500 text-white px-4 py-2 rounded",STOCK_MSG:"text-sm text-gray-500 mt-2"};function U(n,t,e){return`
      총액: ${Math.round(n)}원${t>0?`<span class="text-green-500 ml-2">(${(t*100).toFixed(1)}% 할인 적용)</span>`:""}<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${e})</span>
    `}function L(n){return n.filter(t=>t.quantity<5).map(t=>`${t.name}: ${t.quantity>0?`재고 부족 (${t.quantity}개 남음)`:"품절"}`).join(`
`)}function b({id:n,name:t,price:e,quantity:a}){return`
      <div id="${n}" class="flex justify-between items-center mb-2">
        <span>${t} - ${e}원 x ${a}</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${n}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${n}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${n}">삭제</button>
        </div>
      </div>
    `}let O,E,p,g,f,C,r=0,y=0,I=0;function _(){O.innerHTML=D(c)}function A(){r=0,y=0;const n=p.children;let t=0;for(let a=0;a<n.length;a++){const s=c.find(m=>m.id===n[a].id),o=parseInt(n[a].querySelector("span").textContent.split("x ")[1]),T=s.price*o;let d=0;y+=o,t+=T,o>=10&&(d={p1:.1,p2:.15,p3:.2,p4:.05,p5:.25}[s.id]||0),r+=T*(1-d)}let e=(t-r)/t;y>=30&&r<t*(1-l.BULK_DISCOUNT_RATE)&&(r=t*(1-l.BULK_DISCOUNT_RATE),e=l.BULK_DISCOUNT_RATE),new Date().getDay()===h.TUESDAY&&(r*=1-l.DAY_DISCOUNT_RATE,e=Math.max(e,l.DAY_DISCOUNT_RATE)),I=Math.floor(r/1e3),g.innerHTML=U(r,e,I),f.textContent=L(c)}function q(){const n=document.getElementById("app");n.innerHTML=`
    <div class="${u.CONTAINER}">
      <div class="${u.WRAPPER}">
        <h1 class="${u.HEADING}">장바구니</h1>
        <div id="${i.CART_ITEMS}"></div>
        <div id="${i.CART_TOTAL}" class="${u.TOTAL}"></div>
        <select id="${i.PRODUCT_SELECT}" class="${u.SELECT}"></select>
        <button id="${i.ADD_TO_CART_BUTTON}" class="${u.BUTTON}">추가</button>
        <div id="${i.STOCK_STATUS}" class="${u.STOCK_MSG}"></div>
      </div>
    </div>
  `,p=document.getElementById(i.CART_ITEMS),g=document.getElementById(i.CART_TOTAL),O=document.getElementById(i.PRODUCT_SELECT),E=document.getElementById(i.ADD_TO_CART_BUTTON),f=document.getElementById(i.STOCK_STATUS),_(),A(),E.addEventListener("click",function(){const t=O.value,e=c.find(s=>s.id===t);if(!e||e.quantity<=0)return alert(S.OUT_OF_STOCK);const a=document.getElementById(e.id);if(a){const s=parseInt(a.querySelector("span").textContent.split("x ")[1])+1;if(s<=e.quantity)a.querySelector("span").textContent=`${e.name} - ${e.price}원 x ${s}`,e.quantity--;else return alert(S.OUT_OF_STOCK)}else p.innerHTML+=b({...e,quantity:1}),e.quantity--;A(),C=t}),p.addEventListener("click",function(t){const e=t.target;if(!e.classList.contains("quantity-change")&&!e.classList.contains("remove-item"))return;const a=e.dataset.productId,s=document.getElementById(a),o=c.find(d=>d.id===a),T=parseInt(s.querySelector("span").textContent.split("x ")[1]);if(e.classList.contains("quantity-change")){const d=parseInt(e.dataset.change),m=T+d;if(m>0&&m<=o.quantity+T)s.querySelector("span").textContent=`${o.name} - ${o.price}원 x ${m}`,o.quantity-=d;else if(m<=0)s.remove(),o.quantity-=d;else return alert(S.OUT_OF_STOCK)}else o.quantity+=T,s.remove();A()}),setTimeout(()=>{setInterval(()=>{const t=c[Math.floor(Math.random()*c.length)];Math.random()<l.FLASH_SALE_PROBABILITY&&t.quantity>0&&(t.price=Math.round(t.price*(1-l.FLASH_SALE_DISCOUNT_RATE)),alert(x(t.name)),_())},3e4)},Math.random()*1e4),setTimeout(()=>{setInterval(()=>{if(C){const t=c.find(e=>e.id!==C&&e.quantity>0);t&&(alert($(t.name)),t.price=Math.round(t.price*(1-l.SUGGESTION_DISCOUNT_RATE)),_())}},6e4)},Math.random()*2e4)}q();
