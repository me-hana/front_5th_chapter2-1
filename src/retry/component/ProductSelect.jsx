import { CLASS } from '../../constant/class';
import { ID } from '../../constant/id';

// 제품 선택 셀렉트 박스 (+버튼 포함)
export default function ProductSelect() {
  return (
    <div id={ID.PRODUCT_SELECT}>
      <button id={ID.ADD_TO_CART_BUTTON} className={CLASS.BUTTON}>
        추가
      </button>
    </div>
  );
}
