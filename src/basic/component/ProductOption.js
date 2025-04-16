export function ProductOptions(products) {
  return products
    .map((item) => {
      const disabled = item.quantity === 0 ? 'disabled' : '';
      return `<option value="${item.id}" ${disabled}>${item.name} - ${item.price}원</option>`;
    })
    .join('');
}
