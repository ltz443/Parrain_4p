import { writeFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const today = new Date().toISOString().split('T')[0];

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

async function generateSitemap() {
  console.log('🔄 Génération du sitemap.xml avec les offres Supabase...');

  const staticRoutes = [
    { loc: '/',            changefreq: 'weekly',  priority: '1.0' },
    { loc: '/avis',        changefreq: 'weekly',  priority: '0.8' },
    { loc: '/calculateur', changefreq: 'monthly', priority: '0.7' },
    { loc: '/faq',         changefreq: 'monthly', priority: '0.7' },
  ];

  const base = 'https://parrain-4p.vercel.app';

  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définies.');
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: offres, error } = await supabase
      .from('offre')
      .select('ID_Technique')
      .eq('Afficher_sur_le_site', true);

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message}`);
    }

    const dynamicRoutes = offres.map(offre => ({
      loc: `/offres/${offre.ID_Technique}`,
      changefreq: 'weekly',
      priority: '0.9',
    }));

    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    // Construction du XML sans aucun espace ni saut de ligne au début
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    allRoutes.forEach(r => {
      xml += '  <url>\n';
      xml += `    <loc>${base}${r.loc}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
      xml += `    <priority>${r.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';

    writeFileSync('public/sitemap.xml', xml.trim());
    console.log(`✅ sitemap.xml généré avec ${allRoutes.length} URLs pour le ${today}`);
  } catch (err) {
    console.error('❌ Erreur lors de la génération du sitemap:', err.message);
    process.exit(1);
  }
}

generateSitemap();
