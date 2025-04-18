import { CLASS } from '../../constant/class';
import { ID } from '../../constant/id';
import CartItem from './CartItem';

// 장바구니에 추가한 목록들 전체 (CartItem의 부모)
export default function CartList() {
  return (
    <div id={ID.CART_TOTAL} className={CLASS.TOTAL}>
      <CartItem />
    </div>
  );
}
