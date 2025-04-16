export function StockInfo(products) {
  return products
    .filter((item) => item.quantity < 5)
    .map((item) => {
      return `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절'}`;
    })
    .join('\n');
}
