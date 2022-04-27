module.exports = {
    chainWebpack: config => {
        config.module
            .rule('js')
            .use('babel-loader')
                .loader('babel-loader')
                .end()
    }
}