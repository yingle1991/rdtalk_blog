import Vue from 'vue'
import Vuex from 'vuex'
import { getUserInfo } from '@/api/member/userProfile.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		store: {},
		cart: [],
		token:"",
		userInfo: {}, 
		orderType: 'takein',
		address: {},
		member: {},
		order: {}
	},
	getters: {
		hasLogin(state){
			return !!state.token;
		}
	},
	mutations: {
		SET_ORDER_TYPE(state, type) {
			state.orderType = type
		},
		SET_MEMBER(state, member) {
			state.member = member
		},
		SET_STORE(state, store) {
			state.store = store
		},
		SET_CART(state, cart) {
			state.cart = cart
		},
		// 更新 state 的通用方法
		setStateAttr(state, param) {
			if (param instanceof Array) {
				for(let item of param){
					state[item.key] = item.val;
				}
			} else {
				state[param.key] = param.val;
			}
		},
		// 更新token
		setToken(state, data) {
			// 设置 Token
			const { token } = data;
			state.token = token;
			uni.setStorageSync('token', token);
			
			// 加载用户信息
			this.dispatch('obtainUserInfo');
		},
		REMOVE_CART(state) {
			state.cart = []
		},
		SET_ORDER(state, order) {
			state.order = order
		}
	},
	actions: {
		async getStore({commit}) {
			const store = await api('store')
			commit('SET_STORE', store)
		},
		// 获得用户基本信息
		async obtainUserInfo({state, commit}) {
			const data = await getUserInfo();
			commit('setStateAttr', {
				key: 'userInfo',
				val: data
			});
		}
	}
})

export default store