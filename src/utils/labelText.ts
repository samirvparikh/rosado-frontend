/** "Line 1 / Line 2" for a custom perfume's personalised bottle label, or "" when blank. */
export function labelText(item: { labelLine1?: string | null; labelLine2?: string | null }): string {
  return [item.labelLine1, item.labelLine2].filter((line) => line && line.trim()).join(" / ");
}
