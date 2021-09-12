module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300
    return config
  },
  webpack: (config, options) => {
    config.experiments = {
      topLevelAwait: true,
    }
    return config
  },

  publicRuntimeConfig: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_NGINX_BASE_URL: process.env.NEXT_PUBLIC_NGINX_BASE_URL,
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
  },
  serverRuntimeConfig: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_NGINX_BASE_URL: process.env.NEXT_PUBLIC_NGINX_BASE_URL,
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
  },
}
