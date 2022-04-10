<template>
	<!-- <lee-select-city
		:getPosition="getPosition"
		:data="selectList"
		hotCities
		@submit="submitHandler"
		@select-current="useCurrentPosition"
	></lee-select-city> -->
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">选择工厂</block>
		</cu-custom>
		<view style="width:750upx">
			<factorySelect :factoryList="selectList"></factorySelect>
		</view>
	</view>
</template>

<script>
	import factorySelect from '@/components/rdtalk-select-factory/rdtalk-select-factory.vue';
	import {
		getFactoryList
	} from '@/api/factory/factory.js'
	export default {
		components: {
			factorySelect
		},
		data() {
			return {
				selectList: []
			}
		},
		mounted() {
			uni.setTabBarStyle({
				backgroundImage: "linear-gradient(to top left, #0081ff, #1cbbb4)"
			});
			this.getSelectList();
		},
		methods: {
			submitHandler({
				simple
			}) {
				uni.showModal({
					title: '当前选择',
					content: simple.join('/')
				})
			},
			getSelectList() {
				this.loading = true;
				const selectPromise = getFactoryList();
				selectPromise.then(data => {
					console.log(data);
					this.selectList = data
				}).catch(errors => {}).finally(() => {
					this.loading = false;
				})
			},
			useCurrentPosition(name) {
				uni.showModal({
					title: '使用当前定位',
					content: name
				})
			},

			getPosition() {
				return Math.random() > 0.5 ? '测试服务' : '扶风服务'
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
</style>
