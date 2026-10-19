import { Link, NavLink } from "react-router-dom";
import { Drawer } from "@/components/ui/Drawer";
import { HeartIcon } from "@/components/ui/HeartIcon";
import { BagIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/ui/Icons";
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
      <div className="mx-auto grid max-w-page grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-10 xl:flex xl:justify-between">
        <div className="flex items-center xl:hidden">
          <button
            type="button"
            className="-ml-2 inline-flex items-center gap-2 p-2 text-[11px] uppercase tracking-nav transition-colors hover:text-gold"
            aria-label="Open menu"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNav(true)}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>

        <Link
          to="/"
          className="justify-self-center whitespace-nowrap font-display text-xl tracking-brand text-charcoal sm:text-3xl"
        >
          ROSADO
        </Link>

        <nav className="hidden items-center gap-1 2xl:gap-1.5 xl:flex" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap px-2.5 py-2 text-[13px] uppercase tracking-[0.12em] transition-colors 2xl:px-3 ${
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

        <div className="flex items-center justify-self-end gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => setSearch(true)}
            className="inline-flex p-1 transition-colors hover:text-gold"
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
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileNav(false)}
              className={({ isActive }) =>
                `px-3 py-3 text-sm uppercase tracking-[0.12em] transition-colors ${
                  isActive ? "bg-charcoal text-ivory" : "text-charcoal hover:bg-gold hover:text-charcoal"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-6 flex flex-col gap-1 border-t border-sand pt-6">
          <Link
            to={session ? "/account" : "/login"}
            onClick={() => setMobileNav(false)}
            className="flex items-center gap-3 px-3 py-3 text-[13px] uppercase tracking-nav text-charcoal hover:text-gold"
          >
            <UserIcon />
            {session ? "Account" : "Sign in"}
          </Link>
          <Link
            to="/account/wishlist"
            onClick={() => setMobileNav(false)}
            className="flex items-center gap-3 px-3 py-3 text-[13px] uppercase tracking-nav text-charcoal hover:text-gold"
          >
            <HeartIcon filled={wishlistCount > 0} />
            Wishlist{wishlistCount ? ` (${wishlistCount})` : ""}
          </Link>
        </div>
      </Drawer>

      <SearchOverlay open={searchOpen} onClose={() => setSearch(false)} />
    </header>
  );
}
