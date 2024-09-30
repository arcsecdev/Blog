/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ARCSEC_API_KEY: process.env.ARCSEC_API_KEY,
    ARCSEC_DB_ID: process.env.ARCSEC_DB_ID,
    ARCSEC_WALLET_ADDRESS: process.env.ARCSEC_WALLET_ADDRESS,
  },
}

module.exports = nextConfig