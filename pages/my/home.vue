<template>
	<view class="wrapper">
		<!-- <cu-custom bgColor="bg-gradual-blue">
			<block slot="content">物流工具
			</block>
		</cu-custom> -->
		
		<view class="user-wrapper">
			<!-- <image class="user-background" src="/static/backgroud/user.jpg"></image> -->
			<view class="user">
				<!-- 头像 -->
				<image class="avatar" :src="userInfo.avatar || '/static/icon/default-avatar.png'" @click="navTo('/pages/set/userInfo', {login: true})"></image>
				<!-- 已登陆，展示昵称 -->
				<view class="cen column" v-if="hasLogin">
					<text class="username f-m">{{ userInfo.nickname }}</text>
					<text class="group">普通会员</text>
				</view>
				<!-- 未登陆，引导登陆 -->
				<view class="login-box" v-else @click="login">
					<text>点击注册/登录</text>
				</view>
			</view>
			<!-- 下面的圆弧 -->
			<image class="user-background-arc-line" src="/static/icon/arc.png" mode="aspectFill"></image>
		</view>
		
		
		<!-- <navigator target="miniProgram" app-id='wx7c69ce7f11709260' path='/pages/other/other?id=1' version='release'
			hover-class="none">
			<view class="dong">
				<view class="monster">
					<view class="monster__face">
						<view class="monster__eye avatar-eye avatar-eye--green eye--left">
							<view class="avatar-eye-pupil pupil--green"><span class="avatar-eye-pupil-blackThing"><span
										class="avatar-eye-pupil-lightReflection"></span></span></view>
						</view>
						<view class="monster__eye avatar-eye avatar-eye--violet eye--right">
							<view class="avatar-eye-pupil pupil--pink"><span class="avatar-eye-pupil-blackThing"><span
										class="avatar-eye-pupil-lightReflection"></span></span></view>
						</view>
						<view class="monster__noses">
							<view class="monster__nose"></view>
							<view class="monster__nose"></view>
						</view>
						<view class="monster__mouth">
							<view class="monster__top"></view>
							<view class="monster__bottom"></view>
						</view>
					</view>
				</view>
			</view>
		</navigator> -->
<!-- 		<view class="" :style="'padding-top:' + CustomBar + 'px;'">
			<view class="cu-list menu my_logo">
				<view class="cu-item" @tap="login">
					<view class="cu-avatar round xl margin-right-sm shadow-blur-lg bg-img open-data">
						<open-data type="userAvatarUrl"></open-data>
					</view>
					<view class='content flex-sub'>
						<view class='padding-left-sm text-xxl text-shadow-a padding-top-sm'>
							<open-data type="userNickName"></open-data>
						</view>
						<view
							class='text-lg flex justify-between padding-left-sm padding-top-sm text-shadow-a'>
							欢迎访问ITMS
							<!-- <view class="text-sm">
		                  <text class="icon-attentionfill"></text> 10
		                  <text class="icon-appreciatefill"></text> 20
		                  <text class="icon-messagefill"></text> 30
		                </view> 
						</view>
					</view>
				</view>
			</view>
		</view> -->

		<view class="margin flex">
			<view class='bg-white flex-sub margin-right my-radius shadow-shop'>
				<view class="cu-list grid col-1 no-border my-iconcolor my-radius cu-list-no">
					<view class="cu-item my-icon">
						<view @click="copyWebsite">
							<image src='/static/images/kefu.png' class='png' mode='aspectFit'></image>
							<text class="text-xl text-my">信息公司</text>
						</view>
					</view>
				</view>
			</view>
			<view class='bg-white flex-sub my-radius shadow-shop'>
				<view class="cu-list grid col-1 no-border my-iconcolor my-radius cu-list-no">
					<view class="cu-item my-icon" @click="navArticle">
						<!-- <navigator url="../../pages/official/official" delta="1" hover-class="none"> -->
						<image src='/static/images/shoucang.png' class='png' mode='aspectFit'></image>
						<text class="text-xl text-my">公众号</text>
						<!-- </navigator> -->
					</view>
				</view>
				
			</view>
		</view>
		<view
			class="cu-list menu card-menu margin-top-xl shadow-shop bg-white text-black my-radius sm-border margin-bottom">
			
			<view class="cu-item">
				<button class='content cu-btn' open-type="feedback">
					<image src='/static/images/fankui.png' class='png' mode='aspectFit'></image>
					<text class='text-lg margin-sm'>问题反馈</text>
				</button>
			</view>
			<view class="cu-item" @click="callPhoneNumber" data-number="13699700470">
				<view class='content'>
					<image src='/static/images/kefu2.png' class='png' mode='aspectFit'></image>
					<text class='text-lg margin-sm'>技术支持</text>
				</view>
				<view class="cu-tag badge margin-top-lg bg-orange light margin-right">信息公司</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,mapState
	} from 'vuex';
	export default {
		data() {
			return {
				token: '',
				avatarImg: "",
				deptName: "",
				beginWorkTime: '',
				workTime: '',
				maxCapacity: 0,
			}
		},
		created() {

		},
		computed: {
			...mapState(['userInfo']),
			...mapGetters(['hasLogin']),
		},
		onShow() {},

		methods: {
			login(){
				this.$mRouter.push({
					route: '/pages/auth/login',
				});
				// uni.login({
				//   provider: 'weixin',
				//   onlyAuthorize:true,
				//   success: function (loginRes) {
				//     console.log(loginRes.code);
				//   }
				// });
			}
		}
	}
</script>

<style lang="scss">
	
	.user-wrapper {
		position: relative;
		overflow: hidden;
		background-color: #0081ff;
		padding-top: calc(var(--status-bar-height) + 82rpx);
		padding-bottom: 6rpx;
		.user {
			display: flex;
			flex-direction: column;
			flex-direction: row;
			align-items: center;
			position: relative;
			z-index: 5;
			padding: 20rpx 30rpx 60rpx;
			.avatar {
				flex-shrink: 0;
				width: 130rpx;
				height: 130rpx;
				border-radius: 100px;
				margin-right: 24rpx;
				border: 4rpx solid #fff;
				background-color: #fff;
			}
			.username {
				font-size: 34rpx;
				color: #fff;
			}
			.group {
				align-self: flex-start;
				padding: 10rpx 14rpx;
				margin: 16rpx 10rpx; // 10rpx 避免距离昵称太近
				font-size: 20rpx;
				color: #fff;
				background-color: rgba(255, 255, 255,.3);
				border-radius: 100rpx;
			}
			.login-box {
				font-size: 36rpx;
				color: #fff;
			}
		}
		.user-background {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 330rpx;
		}
		.user-background-arc-line {
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 9;
			width: 100%;
			height: 32rpx;
		}
	}
	
	.cu-list.menu>.cu-item {
	    background-color: rgba(0, 0, 0, 0);
	  }
	
	  .cu-modal .cu-dialog>.cu-bar:first-child .action {
	    margin-right: 30rpx;
	  }
	
	  .bg-green {
	    background-color: #7FD02B;
	  }
	
	  .my_logo {
	    background: none;
	    padding: 50rpx 0 30rpx 0;
	  }
	
	  .open-data {
	    overflow: hidden;
	    display: block;
	    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
	  }
	
	  .my-radius {
	    border-radius: 12rpx;
	    overflow: hidden
	  }
	
	  .my-icon image {
	    width: 100rpx;
	    height: 100rpx;
	    display: inline-block;
	    margin: 0 auto
	  }
	
	  .my-iconcolor {
	    background: rgba(255, 255, 255, 0.96)
	  }
	
	  .shadow-shop {
	    box-shadow: 0rpx 0rpx 90rpx 0rpx rgba(0, 0, 0, 0.1);
	  }
	
	  .qrcode-img {
	    position: fixed;
	    width: 80rpx;
	    height: 80rpx;
	    bottom: 350rpx;
	    right: 30rpx;
	    z-index: 1024;
	    opacity: 0.8;
	    box-shadow: 0rpx 8rpx 30rpx 0rpx rgba(0, 0, 0, 0.3);
	    border: none
	  }
	
	  .text-my {
	    font-size: 32upx !important;
	    color: #aaa !important;
	  }
	
	  .social-btns .btn {
	    transition: all 0.35s;
	    transition-timing-function: cubic-bezier(0.31, -0.105, 0.43, 1.59);
	  }
	
	  .social-btns .btn .fa {
	    -webkit-transform: scale(0.9);
	    transform: scale(0.9);
	  }
	
	  .social-btns .btn.TNbtn {
	    background-color: #fff;
	  }
	
	  .social-btns .btn.TNbtn .fa {
	    color: #fff;
	  }
	
	
	  .social-btns .btn {
	    /* background-image: linear-gradient(45deg, #f43f3b, #ec008c); */
	    background: linear-gradient(45deg, #9A5CE5, #F15BB5, #ec008c, #f43f3b);
	    background-size: 500% 500%;
	    animation: gradientBG 15s ease infinite;
	    color: #fff;
	    box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.2);
	    opacity: 0.99;
	  }
	
	
	  @keyframes gradientBG {
	    0% {
	      background-position: 0% 50%;
	    }
	
	    50% {
	      background-position: 100% 50%;
	    }
	
	    100% {
	      background-position: 0% 50%;
	    }
	  }
	
	  /* #ifdef H5 */
	  .tn-bg {
	    z-index: 0;
	  }
	
	  /* #endif */
</style>
