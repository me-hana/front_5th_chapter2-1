export default function ProductOption({ products, selectedId, onSelect }) {
  return (
    <select
      className='border rounded p-2 mr-2'
      value={selectedId}
      onChange={(e) => onSelect(e.target.value)}
    >
      {products.map((item) => (
        <option key={item.id} value={item.id} disabled={item.quantity === 0}>
          {item.name} - {item.price}원
        </option>
      ))}
    </select>
  );
}
