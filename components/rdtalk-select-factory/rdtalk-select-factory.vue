<template>
	<div class="wrapper" :style="'top:'+CustomBar+'px'">
		<div class="header">
			<view class="cu-bar search ">
				<view class="search-form">
					<text class="cuIcon-search"></text>
					<input class="input" @input="onInput" placeholder="中文/拼音/首字母" v-model="searchValue" />
				</view>
			</view>

		</div>

		<scroll-view class="calendar-list" scroll-y="true" :scroll-into-view="scrollIntoId">
			<view v-if="disdingwei" id="hot">
				<!-- 定位模块 -->
				<view class="dingwei">
					<view class="dingwei_Tips">
						当前定位
					</view>
					<view class="dingwei_factory">
						<view class="dingwei_factory_one">
							{{position.name}}
						</view>
						<view class="dingweis_div" @click="getWarpweft">
							<image class="dingweis" src="../../static/dingweis.png" mode=""></image>
							<text>{{po_tips}}</text>
						</view>
					</view>
				</view>

				<!-- 最近模块 -->
				<view class="dingwei" v-if="Visit.length>=0">
					<view class="dingwei_Tips">
						最近访问
					</view>
					<view class="dingwei_factory dingwei_factory_zuijin">
						<view class="dingwei_factory_one toright" v-for="(item,index) in Visit" v-if="index<2"
							@click="back_factory(item)">
							{{item.name}}
						</view>
					</view>
				</view>

			</view>


			<!-- 工厂列表 -->
			<view v-if="searchValue == ''" v-for="(item, index) in list" :id="getId(index)" :key="index">
				<view class="letter-header">{{ getId(index) }}</view>
				<view class="factory-div" v-for="(factory, i) in item" :key="i" @click="back_factory(factory)">
					<text class="factory">{{ factory.name }}</text>
				</view>
			</view>
			<!-- 搜索结果 -->
			<view class="factory-div" v-for="(item, index) in searchList" @click="back_factory(item)">
				<text class="factory">{{ item.name }} </text>
			</view>
		</scroll-view>

		<!-- 右侧字母 -->
		<view class="letters" v-if="searchValue == ''">
			<view class="letters-item" @click="scrollTo('hot')">最近</view>
			<view class="letters-item" v-for="item in dataByLetter" :key="item" @click="scrollTo(item)">{{ item }}</view>
		</view>

		<!-- 选中之后字母 -->
		<view class="mask" v-if="showMask">
			<view class="mask-r">{{selectLetter}}</view>
		</view>
	</div>
</template>

<script>
	import factories from '../factory.js';
	export default {
		components: {},
		props: {
			factoryList: {
				type: Array,
				default: () => JSON.parse(JSON.stringify(factories.factories))
			},
		},

		computed: {
			style() {
				var CustomBar = this.CustomBar;
			},
			hotFactory() {
				return factories.hotFactories;
			},
			factorys() {
				return this.factoryList;
			},
		},

		data() {
			return {
				statusBarHeight: this.statusBarHeight,
				CustomBar: this.CustomBar,
				ImgUrl: this.ImgUrl,
				letter: [],
				selectLetter: '',
				searchValue: '',
				scrollIntoId: '',
				list: [],
				tId: null,
				searchList: [],
				showMask: false,
				disdingwei: true,
				Visit: [], //最近访问
				position: {
					"name": "阿尔山",
					"pinyin": "aershan",
					"py": "aes",
					"ip": "10.0.65.132",
					"code": "YIE"
				},
				longitude: '', //经度
				latitude: '', //纬度
				seconds: 3,
				po_tips: '重新定位',
			}
		},
		computed:{
			// 当前二级列表
			list2Data() {
				console.log(this.factoryList);
				return this.factoryList;
			},
			// 获取按Letter分组后的一级列表
			dataByLetter() {
				console.log(this.list);
				//获取factory.js 的程序字母
				var mu = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'w', 'x','y','z'];
				var tmp = [];
				for (var i = 0; i < mu.length; i++) {
					var item = mu[i];
					
					for (var j = 0; j < this.factoryList.length; j++) {
						var py = this.factoryList[j].pinyin;
						console.log("le");
						if (py.substring(0, 1) == item.toUpperCase()) {console.log(py);
							if (tmp.indexOf(item) == -1) {
								this.list.push([this.factoryList[j]]);
								tmp.push(item.toUpperCase());
								this.letter.push(item.toUpperCase());
							} else {
								this.list[i].push(this.factoryList[j]);
							}
						}
					}
				}
				console.log(this.list);
				return tmp;
			},
		},

		created() {
			//获取存储的最近访问
			var that = this
			console.log(this.data);
			uni.getStorage({
				key: 'Visit_key',
				success: function(res) {
					that.Visit = res.data
				}
			});
			//获取定位 经度纬度
			that.getWarpweft()

		},
		methods: {
			getId(index) {
				return this.letter[index];
			},

			scrollTo(letter) {
				this.showMask = true
				this.selectLetter = letter == 'hot' ? '最' : letter
				setTimeout(() => {
					this.showMask = false
				}, 300);
				this.scrollIntoId = letter;
			},


			query(source, text) {
				let res = [];
				var self = this;
				res = source.filter(item => {
					const arr = [];
					let isHave = false;
					Object.keys(item).forEach(prop => {
						const itemStr = item[prop];
						self.isString(itemStr) &&
							itemStr.split(',').forEach(val => {
								arr.push(val);
							});
					});
					arr.some(val => {
						isHave = new RegExp('^' + text).test(val);
						return isHave;
					});
					return isHave;
				});
				console.log(JSON.stringify(res));
				return res;
			},

			isString(obj) {
				return typeof obj === 'string';
			},

			onInput(e) {
				const value = e.target.value;
				console.log(value);
				if (value !== '' && this.list2Data && this.list2Data.length > 0) {
					const queryData = this.query(this.list2Data, String(value).trim());
					this.searchList = queryData;
					this.disdingwei = false
				} else {
					this.searchList = [];
					this.disdingwei = true
				}
			},

			back_factory(item) {
				this.searchList = [];
				if (item) {
					this.$emit('back_factory', item);
					//unshift 把数据插入到首位，与push相反
					this.Visit.unshift(item)
					this.searchValue = "";
					this.disdingwei = true
					var arr = this.Visit
					//数组去重
					function distinct(arr) {
						let newArr = []
						for (let i = 0; i < arr.length; i++) {
							console.log(arr[i]);
							if (newArr.indexOf(arr[i]) < 0) {
								newArr.push(arr[i])
							}
						}
						return newArr
					}
					this.Visit = distinct(arr)
					console.log(this.Visit, "---最近访问")
					uni.setStorage({
						key: 'Visit_key',
						data: this.Visit
					});
				} else {
					this.$emit('back_factory', 'no');
				}

			},
			getWarpweft() {
				var that = this
				that.po_tips = '定位中...'
				let countdown = setInterval(() => {
					that.seconds--;
					uni.getLocation({
						type: 'wgs84',
						success: function(res) {
							console.log('当前位置的经度：' + res.longitude);
							console.log('当前位置的纬度：' + res.latitude);
							that.longitude = res.longitude
							that.latitude = res.latitude
							that.position = {
								"name": "阿尔山1",
								"pinyin": "aershan",
								"py": "aes",
								"ip": "10.0.65.132",
								"code": "YIE"
							}
							console.log(that.position);
						}
					});
					if (that.seconds <= 0) {
						that.seconds = 3
						that.po_tips = '重新定位'
						clearInterval(countdown);
					}
				}, 1000);
			}
		}
	};
</script>

<style scoped>
	.wrapper {
		position: fixed;
		z-index: 999999;
		background: #ffffff;
		height: 100%;
		width: 100%;
		top: 0px;
		left: 0px;
	}

	.mask {
		position: absolute;
		bottom: 0upx;
		top: 83upx;
		left: 0upx;
		right: 0upx;
		width: 750upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0);
	}

	.mask-r {
		height: 120upx;
		width: 120upx;
		border-radius: 60upx;
		display: flex;
		background: rgba(0, 0, 0, 0.5);
		justify-content: center;
		align-items: center;
		font-size: 40upx;
		color: #FFFFFF
	}

	.content {
		height: 100%;
		width: 100%;
		background-color: #ffffff;
	}

	.header {
		height: 85upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}


	.back_div {
		width: 65upx;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.back_img {
		width: 35upx;
		height: 35upx;
	}

	.input {
		font-size: 28upx;
		width: 620upx;
		height: 55upx;
		border-radius: 40upx;
		background-color: #F5F5F5;
		padding-left: 20upx;
		padding-right: 20upx;
		box-sizing: border-box;
	}

	.title {
		font-size: 30upx;
		color: white;
	}

	.show {
		left: 0;
		width: 100%;
		transition: left 0.3s ease;
	}

	.hide {
		left: 100%;
		width: 100%;
		transition: left 0.3s ease;
	}


	.title {
		font-size: 30upx;
		color: white;
	}

	.calendar-list {
		position: absolute;
		top: 83upx;
		bottom: 0upx;
		width: 100%;
		background-color: #FFFFFF;
	}

	.letters {
		position: absolute;
		right: 30upx;
		bottom: 0px;
		width: 50upx;
		top: 260upx;
		color: #2f9bfe;
		text-align: center;
		font-size: 24upx;
	}

	.letters-item {
		margin-bottom: 5upx;
	}

	.letter-header {
		height: 45upx;
		font-size: 22upx;
		color: #333333;
		padding-left: 24upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background-color: #ebedef;

	}

	.factory-div {
		width: 660upx;
		height: 85upx;
		margin-left: 24upx;
		border-bottom-width: 0.5upx;
		border-bottom-color: #ebedef;
		border-bottom-style: solid;
		display: flex;
		align-items: center;
		margin-right: 35upx;
	}

	.factory {
		font-size: 28upx;
		color: #000000;
		padding-left: 30upx;
	}

	.dingwei {
		width: 100%;
		padding-top: 25upx;
		box-sizing: border-box;
		margin-bottom: 26upx;
	}

	.dingwei_Tips {
		margin-left: 24upx;
		margin-bottom: 24upx;
		font-size: 24upx;
		color: #A5A5A5;
	}

	.dingwei_factory {
		width: 100%;
		height: 60upx;
		padding-left: 55upx;
		padding-right: 70upx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.dingwei_factory_one {
		width: 185upx;
		height: 60upx;
		background-color: #F5F5F5;
		border-radius: 10upx;
		font-size: 32upx;
		color: #333333;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.dingweis_div {
		display: flex;
		align-content: flex-end;
		align-items: center;
		font-size: 24upx;
		color: #FD5745;
	}

	.dingweis {
		width: 32upx;
		height: 32upx;
	}

	.dingwei_factory_zuijin {
		display: flex;
		justify-content: flex-start;
	}

	.toright {
		margin-right: 25upx;
	}
</style>
