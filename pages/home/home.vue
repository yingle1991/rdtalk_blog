<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">博客之家</block>
		</cu-custom>
		<!-- 首次进入引导添加到“我的小程序” -->
		<view class="addMyMiniapp" v-if="isFirst" :style="[{top: CustomBar+85+'rpx'}]" catchtap="shutAddMyMiniapp">
			<view>点击加入我的小程序 ↑</view>
			<text>了解 {{webSiteName}} 最新文章</text>
		</view>
		<!-- 标题 -->
		<view class="index-h">
			<font><label class="index-h-blue _span">工</label>具导航</font>
			<font class="index-h-all">滑动查看</font>
		</view>

		<!-- 精选栏目 -->
		<view class="selected-nav" v-if="topNav.length != 0">
			<!-- 栏目列表 -->
			<scroll-view scroll-x>
				<view class="selected-nav-list">
					<block v-for="(item,index) in topNav" :key="index">
						<view v-if="item.redirecttype == 'webpage' || item.redirecttype == 'apppage'">
							<view class="selected-nav-item" catchtap="onNavRedirect" id="item.id"
								data-redicttype="item.redirecttype" data-url="item.url" data-appid="item.appid"
								data-extraData="item.extraData">
								<view>
									<image class="fr-gju-img" :src="item.image"></image>
								</view>
								<view>
									<text>{{item.name}}</text>
								</view>
							</view>
						</view>

						<view v-if="item.redirecttype == 'miniapp'">
							<view class="selected-nav-item">
								<navigator path="item.url" hover-class="none" open-type="navigate" app-id="item.appid"
									target="miniProgram">
									<view>
										<image class="fr-gju-img" src="item.image"></image>
									</view>
									<text>{{item.name}}</text>
								</navigator>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 标题 -->
		<view class="index-h">
			<font v><label class="index-h-blue _span">最</label>新文章</font>
			<font class="index-h-all">All</font>
		</view>

		<!-- 文章列表 -->
		<view v-if="showallDisplay=='block'">
			<view v-for="(item,index) in postsList" :key="index" class="animation-scale-down margin-sm basis-sm shadow" data-class="animation-scale-downs" :style='[{animationDelay:""
				+(index/10<1?(index + 1)*0.1:1+1.01*index)+"s"}]' >
				<view class="cent-div" :index="index" :id="item.id" @click="redictAppDetail(item.slug)" 
					:style='[{opacity: index >= (page-1)*2?"1":" 1"},{transition:"all" + index>=(page-1)*2?(index-(page-1)*2)*0.5+0.5:"0"}]'>
					<view class="cent-dw">
						<view class="cnet-img-w">
							<image class="fr-swiper-img" :src="item.cover" binderror="errorImg" :data-index="index"
								mode="aspectFill"></image>
						</view>
						<view class="cent-wz-h">{{item.title}}</view>
						<!-- <view class="cent-wz-f">
								<rich-text nodes="{{item.excerpt.rendered}}"></rich-text>
							</view> -->
						<view class="cate_meta">{{item.categories[0]&&item.categories[0]['name']}}</view>
						<view class="cent-wz-icon">
							<view class="post-data">
								<image src="../../static/images/calendar.png" mode="widthFix"></image>
								<text>{{dateUtil.timeChange(item.date)}}</text>
								<image src="../../static/images/cate.png" mode="widthFix"></image>
								<!-- <text class="">{{item.categories[0].name}}</text> -->
							</view>
						</view>
					</view>
				</view>
				<view class="cent-div" v-if="isAd.enable&&index%9==0">
					<ad style="transform: none" :unit-id="isAd.bannerId" bindload="adLoad" binderror="adError"
						bindclose="adClose"></ad>
				</view>
			</view>


			<tempLoading v-if="isLoading"></tempLoading>
			<!-- 无更多文章提示 -->
			<!-- 				<view v-if="floatDisplay" class="loadingmore" >
					<view class="no-more" :hidden="!isLastPage">- 无更多文章 -</view>
				</view> -->
		</view>
		<view class="cu-tabbar-height"></view>
	</view>
</template>
<script>
	import {
		getPostList
	} from '@/api/blog/blog.js'

	export default {
		data() {
			return {
				statusBarHeight: this.statusBarHeight,
				CustomBar: this.CustomBar,
				postsList: [], // 文章列表
				postsShowSwiperList: [], //轮播i图列表
				isLastPage: false,
				page: 1, // 请求页数
				pageCounts: 0, // 总的页数
				showerror: "none", // 网络加载失败问题
				showallDisplay: "block",
				displaySwiper: "none",
				floatDisplay: "none", // 底部文章的提示
				isFirst: true, // 右上角,
				isLoading: false,
				webSiteName: "乐子侃生活",
				isAd: {
					"enable": false,
					"bannerId": 'adunit-c9dae21126085de9'
				},
				topNav: [{
						id: '1',
						name: '热门排行',
						image: '../../static/icon/index/1.png',
						url: '../hot/hot',
						redirecttype: 'apppage',
						appid: '',
						extraData: ''
					},
					{
						id: '5',
						name: '搜索文章',
						image: '../../static/icon/index/2.png',
						url: '../search/search',
						redirecttype: 'apppage',
						appid: '',
						extraData: ''
					},
					{
						id: '7',
						name: '问答讨论',
						image: '../../static/icon/index/3.png',
						url: '../feng/feng',
						redirecttype: 'apppage',
						appid: '',
						extraData: ''
					},
					{
						id: '10',
						name: '关于我们',
						image: '../../static/icon/index/4.png',
						url: '../about/about',
						redirecttype: 'apppage',
						appid: '',
						extraData: ''
					}
				],
				// 轮播
				indicatorDots: true, //是否显示圆点
				autoplay: true, //是否自动滚动
				interval: 3000, //轮播时间
				duration: 500,
				indicator_color: "rgba(217, 217, 217, 1)", //指示点颜色
				indicator_active_color: "#3F91F0", //指示点选中颜色
			}
		},
		onLoad() {

			this.isFirst = true;
		},
		mounted() {
			this.isLoading = true;
			this.getPostList();
			let self = this;

			// 打开小程序右上角提示
			setTimeout(function() {
				self.isFirst = false;
			}, 5000)

		},
		// 加载更多
		onReachBottom() {
			console.log("上啦加载");
			this.isLoading = true;
		},
		methods: {
			// 加载更多
			loadmore() {
				// console.log("上啦加载");
				// this.isLoading=true;
				let self = this;
				if (!this.isLastPage && this.page < this.pageCounts) {
					this.page = this.page + 1;
					this.isLoading = true;
					this.getPostList();
				} else {
					this.floatDisplay = 'block';
					this.isLoading = false;
					this.isLastPage = true;
					this.showerror = 'none';
				}
			},
			getPostList() {

				const postListPromise = getPostList(this.page);
				postListPromise.then(res => {
					console.log(res);
					this.pageCounts = res.pageCount;
					this.postsList = [...this.postsList, ...res.data];
				}).catch(errors => {}).finally(() => {
					wx.stopPullDownRefresh();
					this.isLoading = false;

				})
			},
			// 跳转至查看小程序列表页面或文章详情页
			redictAppDetail(url) {
				console.log(url);
				
				if (url) {
					uni.navigateTo({
						url: `/pages/blog/articles/articles?id=${url}`,
						success: (result) => {

						},
						fail: () => {},
						complete: () => {}
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	@import "../../colorui/animation.css";
	.page {
		height: 90%;
		bottom: 200px;
		padding-bottom: 200px;
	}

	/* 引导添加到我的小程序 */
	.addMyMiniapp {
		color: $themeLightColor;
		line-height: 1.2;
		background: $firstwordColor;
		padding: 24rpx 24rpx;
		border-radius: 12rpx;
		position: fixed;
		right: 110rpx;
		z-index: 999;
		box-shadow: 0 16rpx 30rpx -12rpx $shadowColor;
	}

	.addMyMiniapp>view {
		font-size: 24rpx;
		font-weight: 500;
	}

	.addMyMiniapp>text {
		font-size: 20rpx;
		font-weight: 200;
	}

	.addMyMiniapp::before {
		content: '';
		width: 20rpx;
		height: 20rpx;
		background: $firstwordColor;
		transform: rotate(45deg);
		position: absolute;
		right: 30rpx;
		top: -10rpx;
	}

	.cent-wz-icon {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-pack: end;
		-webkit-justify-content: flex-end;
		justify-content: flex-end;
		margin: 0rpx 28rpx 24rpx 28rpx;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
	}

	.cent-wz-f {
		margin: 8rpx 28rpx;
		color: #3d4e82;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 28rpx;
	}

	.cent-wz-h {
		margin: 14rpx 28rpx;
		font-size: 30rpx;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.cnet-img-w {
		height: 188rpx;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		overflow: hidden;
	}

	.cent-dw {
		position: relative;
		border-radius: 20rpx;
		border: 1px $themeLightColor solid;
		box-shadow: -3rpx 0rpx 10rpx $shadowColor;
	}

	.cent-dw .cate_meta {
		position: absolute;
		padding: 8rpx 20rpx;
		background: #fff;
		border-radius: 14rpx;
		font-size: 25rpx;
		margin-right: 24rpx;
		font-weight: 700;
		color: #000;
		top: 24rpx;
		right: 0;
		box-shadow: 0 0 10rpx rgba(204, 204, 204, 0.377);
	}

	.cent-div {
		margin-top: 50rpx;
		margin-bottom: 9rpx;
		margin-left: 24rpx;
		margin-right: 24rpx;
	}

	/* 标题 */
	.index-h-all {
		color: $SubtitleColor;
		font-size: 400;
		font-size: 28rpx;
	}

	.index-h {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		margin: 24rpx 30rpx 0rpx 30rpx;
		font-size: 32rpx;
		font-weight: 600;
	}

	.index-h-blue {
		color: $firstwordColor;
	}

	.ma-60 {
		margin-top: 50rpx;
	}

	/* 轮播 */
	.uni-margin-wrap {
		width: 690rpx;
		margin: 0 30rpx;
		border-radius: 20rpx;
		margin-top: 20rpx;
	}

	.swiper {
		height: 400rpx;
	}

	.swiper-item {
		display: block;
		height: 340rpx;
		border-radius: 20rpx;
		overflow: hidden;
		/* box-shadow:0px 5px 15px rgba(0,0,0,0.16); */
		position: relative;
	}

	.fr-swiper-img {
		width: 100%;
		height: 100%;
	}

	.fr-swiper-cent {
		position: absolute;
		z-index: 2;
		bottom: 28rpx;
		overflow: hidden;
		border-radius: 20rpx;
		-webkit-backdrop-filter: blur(90px);
		backdrop-filter: blur(90px);
		/* background-color: rgba(255, 255, 255, 0.7); */
		width: 65%;
		margin-left: 15%;
		padding: 10rpx 20rpx;
	}

	.fr-swiper-ff {
		color: $themeLightColor;
		width: 88%;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.fr-yuan-d {
		position: absolute;
		right: 20rpx;
		top: 16rpx;
		height: 40rpx;
		width: 40rpx;
		border-radius: 50%;
		background-color: #d8d8d8;
		overflow: hidden;
	}

	/* 精选栏目菜单导航 */
	.fr-gju-dx {
		width: 156rpx;
		height: 156rpx;
		border-radius: 6rpx;
		background: #f5f7f7;
	}

	.fr-gju-img {
		height: 100rpx;
		width: 100rpx;
	}

	.selected-nav {
		// background-color: $themeLightColor;
		margin: 0rpx 26rpx;
		border-radius: 10rpx;
		margin-top: 30rpx;
	}

	.selected-nav-list {
		display: flex;
		padding: 8rpx 20rpx 8rpx 20rpx;
		justify-content: space-between;
	}

	.selected-nav-item {
		margin-right: 16rpx;
		text-align: center;
		width: 150rpx;
	}

	.selected-nav-item text {
		line-height: 26rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: $titleColor;
		margin-top: -10rpx;
		display: block;
	}

	.post-data image {
		width: 24rpx;
		vertical-align: middle;
	}

	.post-data text {
		font-size: 20rpx;
		color: $SubtitleColor;
		margin-right: 10rpx;
		margin-left: 4rpx;
	}

	.loadingmore,
	.showerror {
		margin: 20rpx 0;
		color: $SubtitleColor;
		text-align: center;
	}
</style>
