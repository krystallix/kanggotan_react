export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function kategoriYearSegment(kategoriName: string, year: number): string {
  return `${slugify(kategoriName)}-${year}`
}
