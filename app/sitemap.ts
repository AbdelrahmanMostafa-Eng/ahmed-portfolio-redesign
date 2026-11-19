import type { MetadataRoute } from "next"
import { headers } from "next/headers"

const ROUTES = [
  { path: "", priority: 1 },
  { path: "/projects", priority: 0.8 },
  { path: "/workbench", priority: 0.8 },
  { path: "/notes", priority: 0.7 },
  { path: "/contact", priority: 0.7 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host")
  if (!host) return []
  const protocol = host.startsWith("localhost") ? "http" : "https"
  return ROUTES.map((r) => ({ url: `${protocol}://${host}${r.path}`, changeFrequency: "monthly", priority: r.priority }))
}
