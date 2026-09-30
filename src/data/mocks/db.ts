import type { BottleInventory, CapInventory, Order } from "@/types";
import { bottleInventory as initialBottleInventory } from "./bottles";
import { capInventory as initialCapInventory } from "./caps";
import { readJson, writeJson } from "@/utils/storage";

const ORDER_KEY = "rosado.orders";
const BOTTLE_INV_KEY = "rosado.inventory.bottles";
const CAP_INV_KEY = "rosado.inventory.caps";

export function getPersistedOrders(): Order[] {
  return readJson<Order[]>(ORDER_KEY, []);
}

export function persistOrders(orders: Order[]): void {
  writeJson(ORDER_KEY, orders);
}

export function getBottleInventoryState(): BottleInventory[] {
  return readJson<BottleInventory[]>(BOTTLE_INV_KEY, initialBottleInventory);
}

export function getCapInventoryState(): CapInventory[] {
  return readJson<CapInventory[]>(CAP_INV_KEY, initialCapInventory);
}

export function persistBottleInventory(items: BottleInventory[]): void {
  writeJson(BOTTLE_INV_KEY, items);
}

export function persistCapInventory(items: CapInventory[]): void {
  writeJson(CAP_INV_KEY, items);
}
