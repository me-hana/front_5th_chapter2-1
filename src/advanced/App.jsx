import { useState, useEffect, useMemo } from 'react';
import ProductOption from './component/ProductOption';
import CartItem from './component/CartItem';
import StockInfo from './component/StockInfo';
import CalculateCart from './component/CalculateCart';
import { PRODUCT_LIST as initialProducts } from '../constant/product';
import { DISCOUNT } from '../constant/discount';
import { MESSAGE } from '../constant/message';
import { getFlashSaleMessage, getSuggestMessage } from '../basic/util/messageUtil';

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [selectedId, setSelectedId] = useState(initialProducts[0].id);
  const [lastSelected, setLastSelected] = useState(null);

  // 💰 계산된 값
  const { totalAmt, discRate, bonusPts } = useMemo(() => {
    let total = 0;
    let subTotal = 0;
    let count = 0;

    cart.forEach(({ id, quantity }) => {
      const product = products.find((p) => p.id === id);
      const price = product.price;
      const itemTotal = price * quantity;
      let disc = 0;

      if (quantity >= 10) {
        disc =
          {
            p1: 0.1,
            p2: 0.15,
            p3: 0.2,
            p4: 0.05,
            p5: 0.25,
          }[id] || 0;
      }

      total += itemTotal * (1 - disc);
      subTotal += itemTotal;
      count += quantity;
    });

    let finalTotal = total;
    let discountRate = (subTotal - total) / subTotal;

    if (count >= 30 && total < subTotal * (1 - DISCOUNT.BULK_DISCOUNT_RATE)) {
      finalTotal = subTotal * (1 - DISCOUNT.BULK_DISCOUNT_RATE);
      discountRate = DISCOUNT.BULK_DISCOUNT_RATE;
    }

    if (new Date().getDay() === DISCOUNT.DISCOUNT_DAY) {
      finalTotal *= 1 - DISCOUNT.DAY_DISCOUNT_RATE;
      discountRate = Math.max(discountRate, DISCOUNT.DAY_DISCOUNT_RATE);
    }

    return {
      totalAmt: Math.round(finalTotal),
      itemCnt: count,
      discRate: discountRate,
      bonusPts: Math.floor(finalTotal / 1000),
    };
  }, [cart, products]);

  const handleAddToCart = () => {
    const selectedProduct = products.find((p) => p.id === selectedId);
    if (!selectedProduct || selectedProduct.quantity <= 0) {
      alert(MESSAGE.OUT_OF_STOCK);
      return;
    }

    const existing = cart.find((item) => item.id === selectedId);
    if (existing) {
      const newQty = existing.quantity + 1;
      if (newQty > selectedProduct.quantity) {
        alert(MESSAGE.OUT_OF_STOCK);
        return;
      }
      setCart(cart.map((item) => (item.id === selectedId ? { ...item, quantity: newQty } : item)));
    } else {
      setCart([...cart, { id: selectedId, quantity: 1 }]);
    }

    setProducts(
      products.map((p) => (p.id === selectedId ? { ...p, quantity: p.quantity - 1 } : p)),
    );
    setLastSelected(selectedId);
  };

  const handleChangeQty = (id, delta) => {
    const product = products.find((p) => p.id === id);
    const item = cart.find((c) => c.id === id);
    const newQty = item.quantity + delta;
    const restoredStock = product.quantity + (delta < 0 ? -delta : 0);

    if (newQty <= 0) {
      setCart(cart.filter((c) => c.id !== id));
    } else if (newQty <= restoredStock) {
      setCart(cart.map((c) => (c.id === id ? { ...c, quantity: newQty } : c)));
    } else {
      alert(MESSAGE.OUT_OF_STOCK);
      return;
    }

    setProducts(products.map((p) => (p.id === id ? { ...p, quantity: p.quantity - delta } : p)));
  };

  const handleRemove = (id) => {
    const item = cart.find((c) => c.id === id);
    setProducts(
      products.map((p) => (p.id === id ? { ...p, quantity: p.quantity + item.quantity } : p)),
    );
    setCart(cart.filter((c) => c.id !== id));
  };

  // 번개세일 & 추천세일 효과
  useEffect(() => {
    const flashTimer = setInterval(() => {
      const lucky = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < DISCOUNT.FLASH_SALE_PROBABILITY && lucky.quantity > 0) {
        alert(getFlashSaleMessage(lucky.name));
        lucky.price = Math.round(lucky.price * (1 - DISCOUNT.FLASH_SALE_DISCOUNT_RATE));
        setProducts([...products]);
      }
    }, 30000);

    const suggestTimer = setInterval(() => {
      if (!lastSelected) return;
      const suggest = products.find((p) => p.id !== lastSelected && p.quantity > 0);
      if (suggest) {
        alert(getSuggestMessage(suggest.name));
        suggest.price = Math.round(suggest.price * (1 - DISCOUNT.SUGGESTION_DISCOUNT_RATE));
        setProducts([...products]);
      }
    }, 60000);

    return () => {
      clearInterval(flashTimer);
      clearInterval(suggestTimer);
    };
  }, [products, lastSelected]);

  return (
    <div className='bg-gray-100 p-8'>
      <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'>
        <h1 className='text-2xl font-bold mb-4'>장바구니</h1>
        {cart.map(({ id, quantity }) => (
          <CartItem
            key={id}
            product={products.find((p) => p.id === id)}
            quantity={quantity}
            onChangeQty={handleChangeQty}
            onRemove={handleRemove}
          />
        ))}
        <CalculateCart totalAmt={totalAmt} discRate={discRate} bonusPts={bonusPts} />
        <ProductOption products={products} selectedId={selectedId} onSelect={setSelectedId} />
        <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={handleAddToCart}>
          추가
        </button>
        <StockInfo products={products} />
      </div>
    </div>
  );
}
