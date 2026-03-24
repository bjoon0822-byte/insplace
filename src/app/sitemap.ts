import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { adProducts } from '@/data/ads';
import { venues } from '@/data/venues';
import { goodsItems } from '@/data/goods';
import { popupEvents } from '@/data/popups';
import { artists } from '@/data/artists';
import { campaigns } from '@/data/campaigns';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ooh-gray.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages per locale
  const staticPages = ['', '/explore', '/ad', '/venue', '/goods', '/popup', '/trend', '/contact', '/community', '/mypage', '/artists', '/campaigns', '/calendar', '/gallery', '/terms', '/privacy'];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }

    // Ad detail pages
    for (const ad of adProducts) {
      entries.push({
        url: `${BASE_URL}/${locale}/ad/${ad.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    // Venue detail pages
    for (const venue of venues) {
      entries.push({
        url: `${BASE_URL}/${locale}/venue/${venue.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    // Goods detail pages
    for (const item of goodsItems) {
      entries.push({
        url: `${BASE_URL}/${locale}/goods/${item.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }

    // Popup detail pages
    for (const popup of popupEvents) {
      entries.push({
        url: `${BASE_URL}/${locale}/popup/${popup.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }

    // Artist detail pages
    for (const artist of artists) {
      entries.push({
        url: `${BASE_URL}/${locale}/artists/${artist.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    // Campaign detail pages
    for (const campaign of campaigns) {
      entries.push({
        url: `${BASE_URL}/${locale}/campaigns/${campaign.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      });
    }
  }

  return entries;
}
