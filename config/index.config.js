const CONFIG = {
    // 开发环境配置
    development: {
        assetsPath: '/static', // 静态资源路径
		baseUrl:'http://192.168.0.101:48080', // 后台接口请求地址
		itmsUrl:'http://10.0.65.191:8081',//平台验证地址
		blogUrl:'https://blog.rdtalk.cn',//平台验证地址
		
        hostUrl: '', // H5地址(前端运行地址)
        weixinAppId: '' // 微信公众号appid
    },
    // 生产环境配置
    production: {
        assetsPath: '/static', // 静态资源路径
		baseUrl:'https://dstbj.jdsn.com.cn:8022/gcwl/', // 后台接口请求地址
        weixinAppId: 'wx7729ac7a2da1ee1f' // 微信公众号appid

    }

};
export default CONFIG[process.env.NODE_ENV];
