import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  try {
    // 1. Vérifier si déjà inscrit
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(200).json({ status: 'already_subscribed', message: 'Déjà inscrit !' });
    }

    // 2. Insérer dans Supabase
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, source: source || 'community_reviews', is_active: true }]);

    if (insertError) throw insertError;

    // 3. Envoyer email via Resend (si clé présente)
    console.log("RESEND_KEY_EXISTS:", !!resendApiKey); if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: 'Bienvenue chez Parrain 4P !',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <h1 style="color: #00c37a;">Bienvenue !</h1>
                <p>Merci de vous être inscrit à la newsletter de <strong>Parrain 4P</strong>.</p>
                <p>Vous recevrez désormais nos meilleures offres de parrainage et les actualités de la communauté.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">&copy; 2026 Parrain 4P. Tous droits réservés.</p>
              </div>
            `
          })
        });
      } catch (emailError) {
        console.error('Erreur Resend:', emailError);
      }
    } else {
      console.warn('RESEND_API_KEY manquante');
    }

    return res.status(200).json({ status: 'success', message: 'Inscription réussie !' });

  } catch (error) {
    console.error('Erreur API Newsletter:', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
