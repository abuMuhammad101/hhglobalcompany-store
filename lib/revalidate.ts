import { revalidatePath } from "next/cache";

// Every admin mutation that affects public-facing content calls this so
// changes show up immediately, instead of waiting for the page's 60s ISR
// window (and the extra request after that window before Next.js swaps in
// the fresh version).
export function revalidateSite() {
  revalidatePath("/", "layout");
}
