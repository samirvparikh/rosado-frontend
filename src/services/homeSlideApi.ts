import { apiGet } from "./http";
import type { HomeSlide } from "@/types";

/** Active homepage hero slides (images / videos), managed in admin under Content > Home Slider. */
export async function getHomeSlides(): Promise<HomeSlide[]> {
  return apiGet<HomeSlide[]>("/home-slides");
}
