import { createBrowserRouter } from "react-router-dom"
import Dashboard from "../layouts/Dashboard"
import Error from "../layouts/Error"
import DashboardHome from "../pages/DashboardHome/DashboardHome"
import BrandList from "../pages/brands/BrandList"
import ProductList from "../pages/products/ProductList"

export const Routes = createBrowserRouter([
  // dashboard layout
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <DashboardHome />,
      },
      {
        path: "/brand",
        element: <BrandList />,
      },
      {
        path: "/product-list",
        element: <ProductList />,
      },
    ],
  },
])
