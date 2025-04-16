export const getOptionFormat = (name, price) => `${name} - ${price}원`;

export const getTotalAmountFormat = (amount) => `총액: ${Math.round(amount)}원`;

export const getDiscountRateFormat = (rate) => `(${(rate * 100).toFixed(1)}% 할인 적용)`;

export const getLoyaltyPointFormat = (points) => `(포인트: ${points})`;

export const getNoStockFormat = (name, quantity) =>
  `${name}: ${quantity > 0 ? `재고 부족 (${quantity}개 남음)` : '품절'}`;

export const getCartListFormat = (name, price, quantity) => `${name} - ${price}원 x ${quantity}`;
