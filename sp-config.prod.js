const spConfig = {
    projectFiles: [
        './index.html',
        './client/config.js',
        './public/**.*',
        './README.md'
    ],
    coreOptions: {
        siteUrl: ''    // https://{Your Tenant}.sharepoint.com/sites/{Your Prod Site}
    }
}

module.exports = spConfig;