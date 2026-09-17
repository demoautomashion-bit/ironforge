import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Iron District | Gym Management',
    short_name: 'Iron District',
    description: 'A focused dashboard for managing gym members, dues, and payments.',
    start_url: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#080a09',
    theme_color: '#080a09',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
