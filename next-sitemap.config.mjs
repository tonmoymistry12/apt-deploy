/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
    siteUrl: 'https://www.aptcarePetWeb .com', // Your website's base URL
    generateRobotsTxt: true, // This will generate robots.txt file
    sitemapSize: 7000, // Limits the number of URLs per sitemap file
    changefreq: 'daily', // Tells crawlers how often the content updates
    priority: 0.7, // Default priority for URLs
    exclude: ['/admin/**'], // Exclude specific routes or paths
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
        },
        {
          userAgent: '*',
          disallow: '/admin',
        },
      ],
    },
  };
  
  export default sitemapConfig;
  