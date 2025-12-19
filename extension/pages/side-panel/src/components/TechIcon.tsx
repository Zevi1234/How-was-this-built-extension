interface TechIconProps {
  tech: string;
  className?: string;
}

// Map of tech names to their CDN icon URLs (using Simple Icons / DevIcons)
const techIcons: Record<string, string> = {
  // Frontend Frameworks
  'react': 'https://cdn.simpleicons.org/react/61DAFB',
  'next.js': 'https://cdn.simpleicons.org/nextdotjs/white',
  'nextjs': 'https://cdn.simpleicons.org/nextdotjs/white',
  'vue': 'https://cdn.simpleicons.org/vuedotjs/4FC08D',
  'vue.js': 'https://cdn.simpleicons.org/vuedotjs/4FC08D',
  'nuxt': 'https://cdn.simpleicons.org/nuxtdotjs/00DC82',
  'nuxt.js': 'https://cdn.simpleicons.org/nuxtdotjs/00DC82',
  'angular': 'https://cdn.simpleicons.org/angular/DD0031',
  'svelte': 'https://cdn.simpleicons.org/svelte/FF3E00',
  'sveltekit': 'https://cdn.simpleicons.org/svelte/FF3E00',
  'solid': 'https://cdn.simpleicons.org/solid/2C4F7C',
  'solidjs': 'https://cdn.simpleicons.org/solid/2C4F7C',
  'preact': 'https://cdn.simpleicons.org/preact/673AB8',
  'astro': 'https://cdn.simpleicons.org/astro/FF5D01',
  'gatsby': 'https://cdn.simpleicons.org/gatsby/663399',
  'remix': 'https://cdn.simpleicons.org/remix/white',
  'qwik': 'https://cdn.simpleicons.org/qwik/AC7EF4',

  // CSS / Styling
  'tailwind': 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
  'tailwindcss': 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
  'tailwind css': 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
  'daisyui': 'https://cdn.simpleicons.org/daisyui/5A0EF8',
  'daisy ui': 'https://cdn.simpleicons.org/daisyui/5A0EF8',
  'bootstrap': 'https://cdn.simpleicons.org/bootstrap/7952B3',
  'sass': 'https://cdn.simpleicons.org/sass/CC6699',
  'scss': 'https://cdn.simpleicons.org/sass/CC6699',
  'less': 'https://cdn.simpleicons.org/less/1D365D',
  'styled-components': 'https://cdn.simpleicons.org/styledcomponents/DB7093',
  'emotion': 'https://cdn.simpleicons.org/styledcomponents/DB7093',
  'material ui': 'https://cdn.simpleicons.org/mui/007FFF',
  'mui': 'https://cdn.simpleicons.org/mui/007FFF',
  'chakra ui': 'https://cdn.simpleicons.org/chakraui/319795',
  'chakra': 'https://cdn.simpleicons.org/chakraui/319795',
  'ant design': 'https://cdn.simpleicons.org/antdesign/0170FE',
  'antd': 'https://cdn.simpleicons.org/antdesign/0170FE',
  'radix': 'https://cdn.simpleicons.org/radixui/white',
  'shadcn': 'https://cdn.simpleicons.org/shadcnui/white',
  'shadcn/ui': 'https://cdn.simpleicons.org/shadcnui/white',

  // Backend / Runtime
  'node': 'https://cdn.simpleicons.org/nodedotjs/339933',
  'node.js': 'https://cdn.simpleicons.org/nodedotjs/339933',
  'nodejs': 'https://cdn.simpleicons.org/nodedotjs/339933',
  'deno': 'https://cdn.simpleicons.org/deno/white',
  'bun': 'https://cdn.simpleicons.org/bun/white',
  'express': 'https://cdn.simpleicons.org/express/white',
  'express.js': 'https://cdn.simpleicons.org/express/white',
  'fastify': 'https://cdn.simpleicons.org/fastify/white',
  'nest': 'https://cdn.simpleicons.org/nestjs/E0234E',
  'nestjs': 'https://cdn.simpleicons.org/nestjs/E0234E',
  'django': 'https://cdn.simpleicons.org/django/092E20',
  'flask': 'https://cdn.simpleicons.org/flask/white',
  'fastapi': 'https://cdn.simpleicons.org/fastapi/009688',
  'rails': 'https://cdn.simpleicons.org/rubyonrails/CC0000',
  'ruby on rails': 'https://cdn.simpleicons.org/rubyonrails/CC0000',
  'laravel': 'https://cdn.simpleicons.org/laravel/FF2D20',
  'spring': 'https://cdn.simpleicons.org/spring/6DB33F',
  'spring boot': 'https://cdn.simpleicons.org/springboot/6DB33F',

  // Languages
  'typescript': 'https://cdn.simpleicons.org/typescript/3178C6',
  'javascript': 'https://cdn.simpleicons.org/javascript/F7DF1E',
  'python': 'https://cdn.simpleicons.org/python/3776AB',
  'ruby': 'https://cdn.simpleicons.org/ruby/CC342D',
  'go': 'https://cdn.simpleicons.org/go/00ADD8',
  'golang': 'https://cdn.simpleicons.org/go/00ADD8',
  'rust': 'https://cdn.simpleicons.org/rust/white',
  'java': 'https://cdn.simpleicons.org/openjdk/white',
  'kotlin': 'https://cdn.simpleicons.org/kotlin/7F52FF',
  'swift': 'https://cdn.simpleicons.org/swift/F05138',
  'php': 'https://cdn.simpleicons.org/php/777BB4',
  'c#': 'https://cdn.simpleicons.org/csharp/512BD4',
  'c++': 'https://cdn.simpleicons.org/cplusplus/00599C',

  // Databases
  'postgresql': 'https://cdn.simpleicons.org/postgresql/4169E1',
  'postgres': 'https://cdn.simpleicons.org/postgresql/4169E1',
  'mysql': 'https://cdn.simpleicons.org/mysql/4479A1',
  'mongodb': 'https://cdn.simpleicons.org/mongodb/47A248',
  'redis': 'https://cdn.simpleicons.org/redis/DC382D',
  'sqlite': 'https://cdn.simpleicons.org/sqlite/003B57',
  'supabase': 'https://cdn.simpleicons.org/supabase/3FCF8E',
  'firebase': 'https://cdn.simpleicons.org/firebase/FFCA28',
  'prisma': 'https://cdn.simpleicons.org/prisma/2D3748',
  'drizzle': 'https://cdn.simpleicons.org/drizzle/C5F74F',
  'planetscale': 'https://cdn.simpleicons.org/planetscale/white',
  'neon': 'https://cdn.simpleicons.org/neon/white',

  // Cloud / Hosting
  'vercel': 'https://cdn.simpleicons.org/vercel/white',
  'netlify': 'https://cdn.simpleicons.org/netlify/00C7B7',
  'aws': 'https://cdn.simpleicons.org/amazonaws/FF9900',
  'amazon web services': 'https://cdn.simpleicons.org/amazonaws/FF9900',
  'google cloud': 'https://cdn.simpleicons.org/googlecloud/4285F4',
  'gcp': 'https://cdn.simpleicons.org/googlecloud/4285F4',
  'azure': 'https://cdn.simpleicons.org/microsoftazure/0078D4',
  'cloudflare': 'https://cdn.simpleicons.org/cloudflare/F38020',
  'heroku': 'https://cdn.simpleicons.org/heroku/430098',
  'railway': 'https://cdn.simpleicons.org/railway/white',
  'render': 'https://cdn.simpleicons.org/render/46E3B7',
  'digitalocean': 'https://cdn.simpleicons.org/digitalocean/0080FF',
  'fly.io': 'https://cdn.simpleicons.org/flydotio/7B3BE2',

  // CMS / Platforms
  'wordpress': 'https://cdn.simpleicons.org/wordpress/21759B',
  'shopify': 'https://cdn.simpleicons.org/shopify/7AB55C',
  'webflow': 'https://cdn.simpleicons.org/webflow/4353FF',
  'wix': 'https://cdn.simpleicons.org/wix/0C6EFC',
  'squarespace': 'https://cdn.simpleicons.org/squarespace/white',
  'contentful': 'https://cdn.simpleicons.org/contentful/2478CC',
  'sanity': 'https://cdn.simpleicons.org/sanity/F03E2F',
  'strapi': 'https://cdn.simpleicons.org/strapi/4945FF',
  'ghost': 'https://cdn.simpleicons.org/ghost/15171A',

  // State Management
  'redux': 'https://cdn.simpleicons.org/redux/764ABC',
  'zustand': 'https://cdn.simpleicons.org/zustand/white',
  'mobx': 'https://cdn.simpleicons.org/mobx/FF9955',
  'recoil': 'https://cdn.simpleicons.org/recoil/3578E5',
  'jotai': 'https://cdn.simpleicons.org/jotai/white',

  // Build Tools
  'vite': 'https://cdn.simpleicons.org/vite/646CFF',
  'webpack': 'https://cdn.simpleicons.org/webpack/8DD6F9',
  'turbopack': 'https://cdn.simpleicons.org/turbopack/white',
  'esbuild': 'https://cdn.simpleicons.org/esbuild/FFCF00',
  'rollup': 'https://cdn.simpleicons.org/rollupdotjs/EC4A3F',
  'parcel': 'https://cdn.simpleicons.org/parcel/white',

  // Testing
  'jest': 'https://cdn.simpleicons.org/jest/C21325',
  'vitest': 'https://cdn.simpleicons.org/vitest/6E9F18',
  'cypress': 'https://cdn.simpleicons.org/cypress/17202C',
  'playwright': 'https://cdn.simpleicons.org/playwright/2EAD33',
  'testing library': 'https://cdn.simpleicons.org/testinglibrary/E33332',

  // DevOps / Tools
  'docker': 'https://cdn.simpleicons.org/docker/2496ED',
  'kubernetes': 'https://cdn.simpleicons.org/kubernetes/326CE5',
  'github': 'https://cdn.simpleicons.org/github/white',
  'gitlab': 'https://cdn.simpleicons.org/gitlab/FC6D26',
  'github actions': 'https://cdn.simpleicons.org/githubactions/2088FF',
  'jenkins': 'https://cdn.simpleicons.org/jenkins/D24939',
  'terraform': 'https://cdn.simpleicons.org/terraform/7B42BC',
  'nginx': 'https://cdn.simpleicons.org/nginx/009639',
  'graphql': 'https://cdn.simpleicons.org/graphql/E10098',
  'apollo': 'https://cdn.simpleicons.org/apollographql/311C87',
  'trpc': 'https://cdn.simpleicons.org/trpc/2596BE',

  // Analytics / Monitoring
  'google analytics': 'https://cdn.simpleicons.org/googleanalytics/E37400',
  'segment': 'https://cdn.simpleicons.org/segment/52BD95',
  'sentry': 'https://cdn.simpleicons.org/sentry/362D59',
  'datadog': 'https://cdn.simpleicons.org/datadog/632CA6',
  'mixpanel': 'https://cdn.simpleicons.org/mixpanel/7856FF',
  'amplitude': 'https://cdn.simpleicons.org/amplitude/white',
  'posthog': 'https://cdn.simpleicons.org/posthog/white',
  'hotjar': 'https://cdn.simpleicons.org/hotjar/FF3C00',

  // Auth
  'auth0': 'https://cdn.simpleicons.org/auth0/EB5424',
  'clerk': 'https://cdn.simpleicons.org/clerk/6C47FF',
  'nextauth': 'https://cdn.simpleicons.org/nextdotjs/white',
  'oauth': 'https://cdn.simpleicons.org/oauth/white',

  // AI/ML
  'openai': 'https://cdn.simpleicons.org/openai/white',
  'langchain': 'https://cdn.simpleicons.org/langchain/1C3C3C',
  'hugging face': 'https://cdn.simpleicons.org/huggingface/FFD21E',
  'tensorflow': 'https://cdn.simpleicons.org/tensorflow/FF6F00',
  'pytorch': 'https://cdn.simpleicons.org/pytorch/EE4C2C',

  // Payments
  'stripe': 'https://cdn.simpleicons.org/stripe/008CDD',
  'paypal': 'https://cdn.simpleicons.org/paypal/00457C',

  // Other
  'electron': 'https://cdn.simpleicons.org/electron/47848F',
  'tauri': 'https://cdn.simpleicons.org/tauri/FFC131',
  'pwa': 'https://cdn.simpleicons.org/pwa/5A0FC8',
  'socket.io': 'https://cdn.simpleicons.org/socketdotio/white',
  'three.js': 'https://cdn.simpleicons.org/threedotjs/white',
  'framer': 'https://cdn.simpleicons.org/framer/0055FF',
  'framer motion': 'https://cdn.simpleicons.org/framer/0055FF',
  'gsap': 'https://cdn.simpleicons.org/greensock/88CE02',
  'lottie': 'https://cdn.simpleicons.org/lottiefiles/00DDB3',
};

// Normalize tech name for matching
function normalizeTech(tech: string): string {
  return tech.toLowerCase().trim();
}

export function TechIcon({ tech, className = '' }: TechIconProps) {
  const normalized = normalizeTech(tech);
  const iconUrl = techIcons[normalized];

  if (!iconUrl) {
    return null;
  }

  return (
    <img
      src={iconUrl}
      alt={tech}
      className={`w-3.5 h-3.5 ${className}`}
      loading="lazy"
      onError={(e) => {
        // Hide if icon fails to load
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}

// Export for checking if a tech has an icon
export function hasTechIcon(tech: string): boolean {
  return normalizeTech(tech) in techIcons;
}
