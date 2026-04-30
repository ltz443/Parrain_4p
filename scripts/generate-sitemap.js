import { writeFileSync } from 'fs';

const today = new Date().toISOString().split('T')[0]; // "2026-04-30"

const routes = [
  { loc: '/',            changefreq: 'weekly',  priority: '1.0' },
  { loc: '/avis',        changefreq: 'weekly',  priority: '0.8' },
  { loc: '/calculateur', changefreq: 'monthly', priority: '0.7' },
  { loc: '/faq',         changefreq: 'monthly', priority: '0.7' },
];

const base = 'https://parrain-4p.vercel.app';

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `
  <url>
    <loc>${base}${r.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('')}
</urlset>`;

writeFileSync('public/sitemap.xml', xml);
console.log('✅ sitemap.xml généré pour le', today);
