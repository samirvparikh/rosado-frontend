import { Link, NavLink } from "react-router-dom";
import { Drawer } from "@/components/ui/Drawer";
import { HeartIcon } from "@/components/ui/HeartIcon";
import { BagIcon, SearchIcon, UserIcon } from "@/components/ui/Icons";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useUiStore } from "@/store/uiStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { SearchOverlay } from "./SearchOverlay";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/men", label: "Men" },
  { to: "/women", label: "Women" },
  { to: "/unisex", label: "Unisex" },
  { to: "/custom-perfume", label: "Custom Perfume" },
  { to: "/about", label: "About ROSADO" },
  { to: "/contact", label: "Contact" },
];

function CountBubble({ count }: { count: number }) {
  return (
    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] leading-none text-charcoal">
      {count}
    </span>
  );
}

export function Header() {
  const { count } = useCart();
  const { session } = useAuth();
  const wishlistCount = useWishlistStore((state) => state.productIds.length);
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const searchOpen = useUiStore((state) => state.searchOpen);
  const setMobileNav = useUiStore((state) => state.setMobileNav);
  const setSearch = useUiStore((state) => state.setSearch);

  return (
    <header className="sticky top-0 z-40 border-b border-sand/80 bg-ivory/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-page items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            className="text-[11px] uppercase tracking-nav"
            aria-label="Open menu"
            onClick={() => setMobileNav(true)}
          >
            Menu
          </button>
        </div>

        <Link to="/" className="font-display text-2xl tracking-brand text-charcoal sm:text-3xl">
          ROSADO
        </Link>

        <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 text-[13px] uppercase tracking-[0.12em] transition-colors ${
                  isActive
                    ? "bg-charcoal text-ivory"
                    : "text-stone hover:bg-gold hover:text-charcoal"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={() => setSearch(true)}
            className="transition-colors hover:text-gold"
            aria-label="Search"
            title="Search"
          >
            <SearchIcon />
          </button>
          <Link
            to="/account/wishlist"
            className="relative hidden transition-colors hover:text-gold sm:inline-flex"
            aria-label={`Wishlist, ${wishlistCount} items`}
            title="Wishlist"
          >
            <HeartIcon filled={wishlistCount > 0} />
            {wishlistCount ? <CountBubble count={wishlistCount} /> : null}
          </Link>
          <Link
            to={session ? "/account" : "/login"}
            className="hidden transition-colors hover:text-gold sm:inline-flex"
            aria-label="Account"
            title="Account"
          >
            <UserIcon />
          </Link>
          <Link
            to="/cart"
            className="relative inline-flex transition-colors hover:text-gold"
            aria-label={`Cart, ${count} items`}
            title="Cart"
          >
            <BagIcon />
            {count ? <CountBubble count={count} /> : null}
          </Link>
        </div>
      </div>

      <Drawer open={mobileNavOpen} title="ROSADO" onClose={() => setMobileNav(false)} side="left">
        <nav className="flex flex-col gap-5" aria-label="Mobile">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileNav(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 text-base uppercase tracking-[0.12em] ${
                  isActive ? "bg-charcoal text-ivory" : "text-charcoal hover:bg-gold hover:text-charcoal"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/account" onClick={() => setMobileNav(false)} className="text-[13px] uppercase tracking-nav">
            Account
          </Link>
          <Link to="/account/wishlist" onClick={() => setMobileNav(false)} className="text-[13px] uppercase tracking-nav">
            Wishlist
          </Link>
        </nav>
      </Drawer>

      <SearchOverlay open={searchOpen} onClose={() => setSearch(false)} />
    </header>
  );
}
