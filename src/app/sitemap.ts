
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://digifly.dk';
  return [
    { url: base, lastModified: new Date() },
    // TODO: Add dynamic routes from CMS
  ];
}
