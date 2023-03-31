const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        // dev 
        proxy('/api-dev', {  
            target: 'http://localhost:1337', 
            changeOrigin: true,
            pathRewrite: {'^/api-dev': ''}
        }),
        // prod
        // proxy('/api', {
        //     target: 'http://localhost:8081',
        //     changeOrigin: true,
        //     pathRewrite: {'^/api2': ''}
        // })
    )
}
