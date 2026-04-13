from pathlib import Path
import re

path = Path('/home/ubuntu/parrain_4p_audit_2/src/App.jsx')
text = path.read_text()

new_imports = """import React, { useState, useEffect, useCallback } from 'react';
import LogoOffre from './components/LogoOffre';
import Timer from './components/Timer';
import { OFFRES, CATEGORIES, STRIPE_LINK, TAUX_OPTIONS } from './data/catalog';
import { calcul, fmt, pct } from './lib/calcul';
import { useFavorites } from './lib/favorites';

"""

text = re.sub(
    r"^import React, \{ useState, useEffect, useCallback \} from 'react';\nimport \{ createRoot \} from 'react-dom/client';\n\n",
    new_imports,
    text,
    count=1,
)

patterns = [
    r"// ─── LOGIQUE DES FAVORIS ───────────────────────────────────────────\n.*?\n\}\n\n// ─── CONFIGURATION LOGOS",
    r"// ─── CONFIGURATION LOGOS ──────────────────────────────────────────────────────\n.*?\n\}\n\n// ─── DONNÉES PARRAINAGE",
    r"// ─── DONNÉES PARRAINAGE ────────────────────────────────────────────────────────\n.*?\nfunction InputField",
    r"\nconst container = document.getElementById\('root'\);\nif \(container\) \{\n  const root = createRoot\(container\);\n  root.render\(<App />\);\n\}\n?$",
]

replacements = [
    '// ─── COMPOSANTS IMPORTÉS ─────────────────────────────────────────────────────\n\n// ─── CONFIGURATION LOGOS',
    '// ─── COMPOSANTS IMPORTÉS ─────────────────────────────────────────────────────\n\n// ─── DONNÉES PARRAINAGE',
    'function InputField',
    '\n',
]

for pattern, replacement in zip(patterns, replacements):
    text, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError(f'Remplacement échoué pour le motif: {pattern}')

path.write_text(text)
