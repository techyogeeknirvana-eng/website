import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/notes', '/resume-lab', '/opportunities', '/events', '/projects', '/tech-radar', '/roadmaps'],
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://nirvana.community/sitemap.xml',
  };
}
