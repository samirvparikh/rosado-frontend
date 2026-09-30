import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const HomePage = lazy(() => import("@/pages/HomePage").then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import("@/pages/ShopPage").then((m) => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() =>
  import("@/pages/ProductDetailPage").then((m) => ({ default: m.ProductDetailPage })),
);
const CustomPerfumePage = lazy(() =>
  import("@/pages/CustomPerfumePage").then((m) => ({ default: m.CustomPerfumePage })),
);
const CartPage = lazy(() => import("@/pages/CartPage").then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage").then((m) => ({ default: m.CheckoutPage })));
const LoginPage = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("@/pages/RegisterPage").then((m) => ({ default: m.RegisterPage })));
const AccountPage = lazy(() => import("@/pages/AccountPage").then((m) => ({ default: m.AccountPage })));
const OrdersPage = lazy(() => import("@/pages/OrdersPage").then((m) => ({ default: m.OrdersPage })));
const OrderDetailPage = lazy(() =>
  import("@/pages/OrderDetailPage").then((m) => ({ default: m.OrderDetailPage })),
);
const WishlistPage = lazy(() => import("@/pages/WishlistPage").then((m) => ({ default: m.WishlistPage })));
const AboutPage = lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("@/pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const LegalPage = lazy(() => import("@/pages/LegalPage").then((m) => ({ default: m.LegalPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

function Fallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <LoadingSkeleton className="h-64" />
    </div>
  );
}

function page(element: ReactNode) {
  return <Suspense fallback={<Fallback />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: page(<HomePage />) },
      { path: "shop", element: page(<ShopPage />) },
      { path: "men", element: page(<ShopPage />) },
      { path: "women", element: page(<ShopPage />) },
      { path: "unisex", element: page(<ShopPage />) },
      { path: "perfumes/:slug", element: page(<ProductDetailPage />) },
      { path: "custom-perfume", element: page(<CustomPerfumePage />) },
      { path: "cart", element: page(<CartPage />) },
      { path: "checkout", element: page(<CheckoutPage />) },
      { path: "login", element: page(<LoginPage />) },
      { path: "register", element: page(<RegisterPage />) },
      { path: "account", element: page(<AccountPage />) },
      { path: "account/orders", element: page(<OrdersPage />) },
      { path: "account/orders/:id", element: page(<OrderDetailPage />) },
      { path: "account/wishlist", element: page(<WishlistPage />) },
      { path: "about", element: page(<AboutPage />) },
      { path: "contact", element: page(<ContactPage />) },
      { path: "privacy", element: page(<LegalPage kind="privacy" />) },
      { path: "terms", element: page(<LegalPage kind="terms" />) },
      { path: "shipping", element: page(<LegalPage kind="shipping" />) },
      { path: "returns", element: page(<LegalPage kind="returns" />) },
      { path: "*", element: page(<NotFoundPage />) },
    ],
  },
]);
