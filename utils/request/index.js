/* eslint-disable */
import Request from './request';
import { refreshToken } from '@/utils/request';
import indexConfig from '@/config/index.config';
import mHelper from '@/utils/helper';
import store from '@/store';

const http = new Request();
// request全局参数设置
http.setConfig(config => {
	/* 设置全局配置 */
	config.baseUrl = indexConfig.baseUrl; /* 根域名不同 */
	const systemInfo = uni.getSystemInfoSync();
	const systemInfoHeaders = {
		'device-name': systemInfo.brand, // 设备名称
		width: systemInfo.screenWidth, // 屏幕宽度
		height: systemInfo.screenHeight, // 屏幕高度
		os: systemInfo.platform, // 客户端平台
		'os-version': systemInfo.system ,// 操作系统版本
	};
	config.header = {
		...config.header,
		...systemInfoHeaders
	};
	return config;
});

let isRefreshing = false;
let requests = [];
http.interceptor.request(
	config => {
		/* 请求之前拦截器 */
		config.header['Authorization'] = 'Bearer ' + store.state.token;
		// 单租户
		config.header['tenant-id'] = uni.getStorageSync('tenantId') || 1;
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// 刷新refreshToken
async function handleRefreshToken(refresh_token) {
	const params = {};
	params.group = mHelper.platformGroupFilter();
	params.refresh_token = refresh_token;
	await http.post(refreshToken, params).then(async r => {
		store.commit('login', r.data);
		isRefreshing = false;
	});
}
http.interceptor.response(
	async response => {
		const code = response.data.code || 200;
		// 直连工厂
		// var status=response.data.status=='Y'?"200":"400";
		console.log("zhelu :"+code)
		
		/* 请求之后拦截器 */
		switch (parseInt(code)) {
			case 200:
				return response.data;
			case 400:
				mHelper.toast('错误的请求');
				return Promise.reject(response.data.msg);
				break;
			case 401:
				isRefreshing = false;
				// refreshToken 的返回状态为401
				if (response.config.url === refreshToken) {
					uni.removeStorageSync('accessToken');
					await store.commit('logout');
					uni.showModal({
						content: '会话已过期，是否跳转登录页面？',
						success: confirmRes => {
							if (confirmRes.confirm) {
								mHelper.backToLogin();
								throw response.data;
							}
							if (confirmRes.cancel) {
								mHelper.prePage();
								throw response.data;
							}
						}
					});
					break;
				} else {
					// 如果refreshToken为空 则直接跳转登录
					if (!store.state.refreshToken) {
						uni.removeStorageSync('accessToken');
						await store.commit('logout');
						mHelper.backToLogin();
						// uni.showModal({
						// 	content: '会话已过期，是否跳转登录页面？',
						// 	success: confirmRes => {
						// 		if (confirmRes.confirm) {
						// 			mHelper.backToLogin();
						// 			throw response.data.message;
						// 		}
						// 	}
						// });
						throw response.data.msg;
					} else {
						// isRefreshing同一个页面只执行一次
						if (!isRefreshing) {
							isRefreshing = true;
							// 刷新token
							await handleRefreshToken(store.state.refreshToken, response);
							requests.forEach(cb => cb());
							requests = [];
							isRefreshing = false;
							return http.request(response.config);
						} else {
							return new Promise(resolve => {
								// 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
								requests.push(() => {
									resolve(http.request(response.config));
								});
							});
						}
					}
				}
				break;
			case 405:
				mHelper.toast('当前操作不被允许');
				return Promise.reject(response.data.msg);
			case 404:
				mHelper.toast(response.data.msg);
				return Promise.reject(response.data.msg);
			case 1000:
				mHelper.toast(response.data.msg);
				return Promise.reject(response.data.msg);
			case 429:
				mHelper.toast('请求过多，先休息一下吧');
				return Promise.reject(response.data.msg);
			case 500:
				// mHelper.toast('网络异常，请再次提交');
				return Promise.reject(response.data.msg);
			case 3003://重复内容
				return response.data;
			default:
				mHelper.toast(response.data.msg);
				return Promise.reject(response.data.msg);
		}
	},
	error => {
		return Promise.reject(error);
	}
);

export { http };
