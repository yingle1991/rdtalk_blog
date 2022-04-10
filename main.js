import App from './App'
import dateUtil from './utils/dates.js'; 
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
// 如此配置即可
uni.$u.config.unit = 'rpx'

import home from './pages/home/home.vue'
Vue.component('home',home)
import basics from './pages/basics/home.vue'
Vue.component('basics',basics)

import user from './pages/my/home.vue'
Vue.component('user',user)
import tempLoading from './pages/template/loading.vue'
Vue.component('tempLoading',tempLoading)

import store from './store'
// 引入全局方法
import { http } from '@/utils/request';
import $mHelper from '@/utils/helper';
import $mRouter from '@/utils/router';
import $mRoutesConfig from '@/config/routes.config.js';

// 挂载全局自定义方法
Vue.prototype.$mStore = store;
Vue.prototype.$store = store;
Vue.prototype.$http = http;
Vue.prototype.$mHelper = $mHelper;
Vue.prototype.$mRoutesConfig = $mRoutesConfig;
Vue.prototype.$mRouter = $mRouter;
Vue.prototype.dateUtil = dateUtil;

// 全局 Util
import {
	msg,
	isLogin,
	debounce,
	throttle,
	prePage,
	date
} from '@/utils/util'
Vue.prototype.$util = {
	msg,
	isLogin,
	debounce,
	throttle,
	prePage,
	date
}

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

// 路由导航
$mRouter.beforeEach((navType, to) => {
	if (to.route === undefined) {
		throw '路由钩子函数中没有找到to对象，路由信息:' + JSON.stringify(to);
	}
	if (to.route === $mRoutesConfig.login.path && store.getters.hasLogin) {
		uni.reLaunch({
			url: $mHelper.objParseUrlAndParam($mRoutesConfig.main.path)
		});
		return;
	}
	// 过滤需要权限的页面
	if (to.route.requiresAuth) {
		if (store.getters.hasLogin) {
			// 已经登录
			uni[navType]({
				url: $mHelper.objParseUrlAndParam(to.route.path, to.query)
			});
		} else {
			// 登录成功后的重定向地址和参数
			const query = {
				redirectUrl: to.route.path,
				...to.query
			};
			// 没有登录 是否强制登录?
			if (store.state.forcedLogin) {
				uni.redirectTo({
					url: $mHelper.objParseUrlAndParam($mRoutesConfig.login.path, query)
				});
			} else {
				uni.navigateTo({
					url: $mHelper.objParseUrlAndParam($mRoutesConfig.login.path, query)
				});
			}
		}
	} else {
		uni[navType]({
			url: $mHelper.objParseUrlAndParam(to.route, to.query)
		});
	}
});