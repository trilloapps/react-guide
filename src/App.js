import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Customer } from "./pages/customer";
import { Orders } from "./pages/orders";
import { LineItem } from "./pages/lineItem";
import { ItemDetail } from "./pages/itemDetail";
function App(){
return (

<Routes>
  <Route path="/login" element={<Login/>}/>
  <Route path="/" element={<Customer/>}/>
  <Route path="/order" element={<Orders />} />
  <Route path="/items" element={<LineItem />} />
  <Route path="/item-detail" element={<ItemDetail />} />
</Routes>
)
}

export default App;