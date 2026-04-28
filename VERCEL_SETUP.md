# Configuration Vercel - Parrain 4P

## 🎯 Objectif

Configurer Vercel pour que votre site soit **ultra-rapide**, **SEO-friendly**, et **automatiquement mis à jour** quand vous modifiez une offre dans Supabase.

---

## 📋 Étapes de Configuration

### 1️⃣ Vérifier que le projet est déployé sur Vercel

Allez sur [vercel.com](https://vercel.com) et vérifiez que votre projet `Parrain_4p` est connecté.

**URL de production** : https://parrain-4p.vercel.app

---

### 2️⃣ Créer un Deploy Hook

Un **Deploy Hook** est une URL qui déclenche un redéploiement quand vous l'appelez.

#### Étapes :

1. Allez sur **Vercel Dashboard** → Sélectionnez votre projet `Parrain_4p`
2. Cliquez sur **Settings** (⚙️) en haut à droite
3. Dans le menu de gauche, allez à **Git**
4. Cherchez la section **Deploy Hooks**
5. Cliquez sur **Create Hook**
6. Remplissez :
   - **Name** : `Rebuild from Supabase`
   - **Branch** : `main`
7. Cliquez sur **Create**
8. **Copiez l'URL générée** (elle ressemble à : `https://api.vercel.com/v1/integrations/deploy/prj_xxxxx/xxxxx`)

---

### 3️⃣ Configurer la Variable d'Environnement

1. Toujours dans **Settings** → **Environment Variables**
2. Cliquez sur **Add**
3. Remplissez :
   - **Name** : `VERCEL_DEPLOY_HOOK_URL`
   - **Value** : Collez l'URL du Deploy Hook
   - **Environments** : Sélectionnez `Production`
4. Cliquez sur **Save**

---

### 4️⃣ Configurer les Build Settings

Vercel devrait déjà avoir détecté que c'est un projet Vite. Vérifiez :

1. **Settings** → **Build & Development Settings**
2. Vérifiez que :
   - **Framework Preset** : `Vite`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install` (ou `pnpm install`)

3. Cliquez sur **Save**

---

### 5️⃣ Tester le Build

1. Allez à **Deployments** en haut du dashboard
2. Cliquez sur le dernier déploiement
3. Vérifiez les logs pour voir si le build SSG a fonctionné
4. Vous devriez voir :
   ```
   🔄 Génération des offres statiques...
   ✅ 16 offres générées avec succès dans public/data/offres.json
   ```

---

## 🔄 Utiliser les Deploy Hooks

### Option A : Déclencher manuellement (depuis votre ordinateur)

```bash
node scripts/trigger-deploy.js
```

**Prérequis** : La variable d'environnement `VERCEL_DEPLOY_HOOK_URL` doit être configurée localement.

### Option B : Déclencher via curl

```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_xxxxx/xxxxx
```

Remplacez `xxxxx` par votre URL du Deploy Hook.

### Option C : Webhook Supabase (Automatique)

Chaque fois que vous modifiez une offre dans Supabase, un redéploiement est déclenché automatiquement.

#### Configuration :

1. Allez dans **Supabase Dashboard** → Votre projet
2. Cliquez sur **Database** → **Webhooks** (en bas à gauche)
3. Cliquez sur **Create a new webhook**
4. Remplissez :
   - **Name** : `Trigger Vercel Rebuild`
   - **Table** : `offres`
   - **Events** : Cochez `INSERT`, `UPDATE`, `DELETE`
   - **HTTP Request** :
     - **Method** : `POST`
     - **URL** : Votre Deploy Hook Vercel
5. Cliquez sur **Create webhook**

Maintenant, **chaque modification d'offre dans Supabase déclenchera automatiquement un rebuild** ! 🚀

---

## 👀 Preview Deployments

### Qu'est-ce que c'est ?

Vercel crée automatiquement une **preview URL** pour chaque branche ou pull request. Vous pouvez tester vos changements avant de les merger en production.

### Utiliser les Previews

#### 1. Créer une branche locale

```bash
git checkout -b feature/new-offer
# Faites vos modifications
git push origin feature/new-offer
```

#### 2. Vercel crée automatiquement une Preview

- Allez sur votre dépôt GitHub
- Vercel crée une **Preview Deployment** avec une URL unique
- Testez vos changements sur cette URL

#### 3. Merger quand c'est prêt

```bash
git checkout main
git merge feature/new-offer
git push origin main
```

Vercel redéploie automatiquement la production ! ✅

---

## ⚡ Performance & SEO

### Avant (Client-Side Rendering)
```
Utilisateur visite le site
    ↓
HTML vide reçu (~50 KB)
    ↓
JavaScript téléchargé et exécuté (~200 KB)
    ↓
Requête API à Supabase
    ↓
Offres affichées (2-3 secondes)
```

### Après (SSG)
```
Utilisateur visite le site
    ↓
HTML complet reçu (~100 KB, avec offres gravées)
    ↓
Site affiché instantanément (~0.5 secondes)
    ↓
JavaScript charge les interactions (favoris, etc.)
```

**Gain** : 4-6x plus rapide + SEO parfait 🚀

---

## 🔍 Vérifier que le SSG fonctionne

### 1. Vérifier le HTML source

1. Allez sur https://parrain-4p.vercel.app
2. Clic droit → **Inspecter** (ou F12)
3. Allez à l'onglet **Elements**
4. Cherchez le texte d'une offre (ex: "Hello bank")
5. Vous devriez voir le texte **directement dans le HTML** (pas seulement dans le JavaScript)

### 2. Vérifier les logs de build

1. Vercel Dashboard → **Deployments**
2. Cliquez sur le dernier déploiement
3. Allez à l'onglet **Logs**
4. Cherchez :
   ```
   ✅ 16 offres générées avec succès
   ```

### 3. Vérifier le fichier JSON

1. Allez sur https://parrain-4p.vercel.app/data/offres.json
2. Vous devriez voir un fichier JSON avec toutes vos offres actives

---

## 🆘 Troubleshooting

### Le build échoue avec "Cannot find module '@supabase/supabase-js'"

**Solution** :
1. Vercel → **Settings** → **Build & Development**
2. Vérifiez que **Install Command** est `npm install` ou `pnpm install`
3. Redéployez

### Les offres ne s'affichent pas après une modification Supabase

**Cause** : Le webhook Supabase n'a pas déclenché le rebuild

**Solution** :
```bash
# Déclencher manuellement
node scripts/trigger-deploy.js

# Ou depuis Vercel Dashboard → Redeploy
```

### Les offres inactives s'affichent toujours

**Cause** : Vous n'avez pas redéployé après avoir changé `is_active` à `false`

**Solution** :
1. Allez dans Supabase et vérifiez que `is_active = false`
2. Déclenchez un rebuild : `node scripts/trigger-deploy.js`
3. Attendez 1-2 minutes

---

## 📊 Monitoring

### Vérifier les performances

1. Vercel Dashboard → **Analytics**
2. Vous verrez :
   - Temps de réponse moyen
   - Nombre de déploiements
   - Erreurs (s'il y en a)

### Vérifier les logs en temps réel

```bash
# Si vous avez Vercel CLI installé
vercel logs --follow
```

---

## ✅ Checklist

- [x] Projet Vercel créé et connecté
- [ ] Deploy Hook créé
- [ ] Variable d'environnement `VERCEL_DEPLOY_HOOK_URL` configurée
- [ ] Build Settings vérifiés
- [ ] Premier build SSG réussi
- [ ] Webhook Supabase configuré (optionnel)
- [ ] Preview Deployments testés
- [ ] HTML source vérifié (offres visibles)

---

## 🚀 Prochaines Étapes

1. **Modifiez une offre** dans Supabase
2. **Déclenchez un rebuild** : `node scripts/trigger-deploy.js`
3. **Attendez 1-2 minutes**
4. **Vérifiez le site** : https://parrain-4p.vercel.app
5. **Vérifiez le HTML source** pour confirmer que les offres sont gravées

---

## 📞 Support

Si vous avez des problèmes :
1. Vérifiez les logs Vercel
2. Vérifiez les logs Supabase
3. Consultez la documentation : [SSG_SETUP.md](./SSG_SETUP.md)

---

**Dernière mise à jour** : 28 avril 2026
