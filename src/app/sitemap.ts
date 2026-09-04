import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ServiceCategory } from '@/types/database';

const CATEGORIES: ServiceCategory[] = [
  'vehicle-rental',
  'tattoo',
  'villa',
  'travel',
  'surfing-lesson',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doamandeh.com';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  let servicePages: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();
    const { data: services } = await supabase
      .from('services')
      .select('id, updated_at')
      .eq('is_active', true);

    if (services) {
      servicePages = services.map((s) => ({
        url: `${baseUrl}/services/${s.id}`,
        lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    // Return base static and category pages if DB is offline during build
  }

  return [...staticPages, ...categoryPages, ...servicePages];
}
