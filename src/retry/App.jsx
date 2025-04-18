import { CLASS } from '../constant/class';
import CartList from './component/CartList';
import Header from './component/Header';
import ProductSelect from './component/ProductSelect';
import StockInfo from './component/StockInfo';

export default function App() {
  return (
    <div className={CLASS.CONTAINER}>
      <div className={CLASS.WRAPPER}>
        <Header />
        <CartList />
        <ProductSelect />
        <StockInfo />
      </div>
    </div>
  );
}
