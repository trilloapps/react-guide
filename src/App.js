import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Customer } from "./pages/customer";
import { Orders } from "./pages/orders";
import { LineItem } from "./pages/lineItem";
import { ItemDetail } from "./pages/itemDetail";
import { useAuth } from './useAuth';
import { Admin } from "./pages/admin";


function App() {
  const { authenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {authenticated && (
        <>
          <Route path="/customers" element={<Customer />} />
          <Route path="/order" element={<Orders />} />
          <Route path="/items" element={<LineItem />} />
          <Route path="/item-detail" element={<ItemDetail />} />
          <Route path="/admin" element={<Admin />} />
        </>
      )}
    </Routes>
  );
}

export default App;