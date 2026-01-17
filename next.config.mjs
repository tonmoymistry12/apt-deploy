import dotenv from "dotenv";

// Load environment variables
const appEnv = process.env.APP_ENV || "DEV";
dotenv.config({ path: `.env.${appEnv}` });
const product = process.env.PRODUCT || "aptcarePetWeb ";
const next_static_build = process.env.NEXT_STATIC_BUILD === "true";

const config = {
  swcMinify: true,
  reactStrictMode: true,
  transpilePackages: [
    '@ant-design/icons',
    'antd',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-table',
    'rc-tree',
    'rc-select'
  ],
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
      },
    };
    return config;
  },
  env: {
    GM_BASE_URL: process.env.GM_BASE_URL,
    RUNNING_ENV: process.env.RUNNING_ENV || "development",
    APP_ENV: appEnv,
    REACT_APP_LOCAL_MODE: process.env.REACT_APP_LOCAL_MODE || "false",
  },
  images: {
    loader: "default",
    domains: [],
  },
  // Only apply static export settings if explicitly enabled
  ...(next_static_build && {
    distDir: "dist",
    output: "export",
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
  }),
  generateBuildId: async () => {
    return process.env.BUILD_ID || `${new Date().getTime()}`;
  },
};

export default config;
