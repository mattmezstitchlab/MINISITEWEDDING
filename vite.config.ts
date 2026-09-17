import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react(), tailwindcss()];
  // Plugin de prévisualisation, présent en local uniquement (voir .gitignore).
  try {
    // @ts-expect-error -- fichier non versionné, absent d’un clone propre.
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {
    // Absent : on continue sans étiquetage des sources.
  }

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
    server: {
      host: true,
      port: 5173,
      // Permet l’aperçu en ligne (hôtes proxifiés) en développement.
      allowedHosts: true as const,
    },
    preview: {
      host: true,
      port: 4173,
      allowedHosts: true as const,
    },
  };
})
