/**
 * Service category display order.
 *
 * Shared between `src/components/home/Services.astro` (homepage section)
 * and `src/pages/services/index.astro` (services page) so they stay in
 * sync without duplicating the array. To reorder categories on either
 * surface, edit this array — do NOT rename content files.
 *
 * The slugs correspond to filenames in `src/content/services/` (without
 * the `.md` extension). Each file's `anchor` frontmatter field is used
 * for the URL hash (e.g. `/services/#branding-design`).
 */
export const SERVICE_ORDER: readonly string[] = [
  'branding-design',
  'websites',
  'marketing-strategy',
  'media',
  'ongoing-support',
] as const;
