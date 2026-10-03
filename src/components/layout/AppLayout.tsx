import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "./Header";
import { OfferHeader } from "./OfferHeader";
import { Footer } from "./Footer";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-ivory focus:px-3 focus:py-2">
        Skip to content
      </a>
      <OfferHeader />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
