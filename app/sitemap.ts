import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://alba-wiki-orcin.vercel.app',
      lastModified: new Date(),
    },
  ]
}