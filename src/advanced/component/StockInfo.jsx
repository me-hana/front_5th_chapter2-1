export default function StockInfo({ products }) {
  const lowStockItems = products.filter((item) => item.quantity < 5);

  if (lowStockItems.length === 0) return null;

  return (
    <div className='text-sm text-gray-500 mt-2'>
      {lowStockItems.map((item) => (
        <div key={item.id}>
          {item.name}: {item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절'}
        </div>
      ))}
    </div>
  );
}
