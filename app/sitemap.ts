import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const baseUrl = 'https://alba-wiki-orcin.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: communities } = await supabase
    .from('communities')
    .select('slug, created_at')

  const { data: posts } = await supabase
    .from('posts')
    .select('id, created_at')

  const communityUrls =
    communities?.map((community) => ({
      url: `${baseUrl}/community/${community.slug}`,
      lastModified: new Date(community.created_at),
    })) || []

  const postUrls =
    posts?.map((post) => ({
      url: `${baseUrl}/post/${post.id}`,
      lastModified: new Date(post.created_at),
    })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...communityUrls,
    ...postUrls,
  ]
}