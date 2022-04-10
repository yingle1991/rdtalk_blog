<!-- /*
 * @Description: 加载动画
 * @Author: Harry
 * @Date: 2021-09-05 12:42:00
 * @Url: https://u.mr90.top
 * @github: https://github.com/rr210
 * @LastEditTime: 2021-09-05 12:45:19
 * @LastEditors: Harry
 */ -->


<template name="tempLoading">
	<view class="sk-three-bounce">
		<view class="sk-child sk-bounce1"></view>
		<view class="sk-child sk-bounce2"></view>
		<view class="sk-child sk-bounce3"></view>
	</view>
</template>
<script>

</script>
<style lang="scss">
	/* 进度条 */

	.sk-three-bounce {
		margin: 20rpx auto;
		width: 200rpx;
		text-align: center;
	}

	.sk-three-bounce .sk-child {
		width: 30rpx;
		height: 30rpx;
		background-color: #118fff;
		border-radius: 100%;
		display: inline-block;
		-webkit-animation: sk-three-bounce 1.4s ease-in-out 0s infinite both;
		animation: sk-three-bounce 1.4s ease-in-out 0s infinite both;
	}

	.sk-three-bounce .sk-bounce1 {
		-webkit-animation-delay: -0.32s;
		animation-delay: -0.32s;
	}

	.sk-three-bounce .sk-bounce2 {
		-webkit-animation-delay: -0.16s;
		animation-delay: -0.16s;
	}

	@-webkit-keyframes sk-three-bounce {

		0%,
		80%,
		100% {
			-webkit-transform: scale(0);
			transform: scale(0);
		}

		40% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}

	@keyframes sk-three-bounce {

		0%,
		80%,
		100% {
			-webkit-transform: scale(0);
			transform: scale(0);
		}

		40% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}
</style>
