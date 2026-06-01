// page.tsx
import { AdminTemplate } from "../components/template";
import ProductList from "./components/ProductList";

export default function ProductsPage() {
  return (
    <AdminTemplate>
      <ProductList />
    </AdminTemplate>
  );
}
