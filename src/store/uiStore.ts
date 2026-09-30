import { create } from "zustand";

interface UiState {
  mobileNavOpen: boolean;
  searchOpen: boolean;
  cartDrawerOpen: boolean;
  setMobileNav: (open: boolean) => void;
  setSearch: (open: boolean) => void;
  setCartDrawer: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  searchOpen: false,
  cartDrawerOpen: false,
  setMobileNav: (mobileNavOpen) => set({ mobileNavOpen }),
  setSearch: (searchOpen) => set({ searchOpen }),
  setCartDrawer: (cartDrawerOpen) => set({ cartDrawerOpen }),
}));
