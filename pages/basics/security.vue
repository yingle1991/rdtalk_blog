<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">检斤查询</block>
		</cu-custom>
		<view v-if="truckBill!=null" class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class='cuIcon-title text-blue'></text>结果
			</view>
		</view>
		<view v-if="truckBill!=null" class="padding-sm">
			<view class="cu-list menu">
				<view class="cu-item" :class="[toggleDelay?'animation-slide-bottom':'']"
					:style="[{animationDelay:1*0.1 + 's'}]">
					<view class="content">
						<text class="text-grey">检斤单号：</text>

					</view>
					<view class="action">
						<!-- <view class="cu-tag round bg-orange light">音乐</view> -->
						<text class="text-grey">{{ truckBill.weightSerialCode }}</text>
					</view>
				</view>

				<view class="cu-item" :class="[toggleDelay?'animation-slide-bottom':'']"
					:style="[{animationDelay:2*0.1 + 's'}]">
					<view class="content">
						<text class="text-grey">付货单号：</text>

					</view>
					<view class="action">
						<!-- <view class="cu-tag round bg-orange light">音乐</view> -->
						<text class="text-grey">{{ truckBill.payNo }}</text>
					</view>
				</view>

				<view class="cu-item" :class="[toggleDelay?'animation-slide-bottom':'']"
					:style="[{animationDelay:3*0.1 + 's'}]">
					<view class="content">
						<text class="text-grey">品种：</text>

					</view>
					<view class="action">
						<!-- <view class="cu-tag round bg-orange light">音乐</view> -->
						<text class="text-grey">{{ truckBill.proName }}</text>
					</view>
				</view>

				<view class="cu-item" :class="[toggleDelay?'animation-slide-bottom':'']"
					:style="[{animationDelay:5*0.1 + 's'}]">
					<view class="content">
						<text class="text-grey">车号：</text>

					</view>
					<view class="action">
						<!-- <view class="cu-tag round bg-orange light">音乐</view> -->
						<text class="text-grey">{{ truckBill.truckNo }}</text>
					</view>
				</view>

				<view class="cu-item" :class="[toggleDelay?'animation-slide-bottom':'']"
					:style="[{animationDelay:6*0.1 + 's'}]">
					<view class="content">
						<text class="text-grey">净重：</text>

					</view>
					<view class="action">
						<!-- <view class="cu-tag round bg-orange light">音乐</view> -->
						<text class="text-grey">{{ truckBill.tareWeight }}</text>
					</view>
				</view>

				<view class="cu-item" :class="[toggleDelay?'animation-slide-bottom':'']"
					:style="[{animationDelay:7*0.1 + 's'}]">
					<view class="content">
						<text class="text-grey">客户名称：</text>

					</view>
					<view class="action">
						<!-- <view class="cu-tag round bg-orange light">音乐</view> -->
						<text class="text-grey">{{ truckBill.accountName }}</text>
					</view>
				</view>

				<view class="cu-item" :class="[toggleDelay?'animation-slide-bottom':'']"
					:style="[{animationDelay:8*0.1 + 's'}]">
					<view class="content">
						<text class="text-grey">运输商称：</text>

					</view>
					<view class="action">
						<!-- <view class="cu-tag round bg-orange light">音乐</view> -->
						<text class="text-grey">{{ truckBill.carryName }}</text>
					</view>
				</view>
			</view>
		</view>
		<button type="primary" @tap="clickBind">扫描绑定</button>
	</view>
</template>

<script>
	import {
		bindTructInfo
	} from '@/api/car.js'
	export default {
		data() {
			return {
				scanList: [{
					"cuIcon": "scan",
					"name": "扫描二维码",
					"color": "red",
					"method": "scan"
				}],
				gridCol: 3,
				gridBorder: false,
				codeResult: "12313",
				codeFac: "CS",
				truckBill: null,
				toggleDelay: false
			};
		},
		onLoad(options) {
			this.truckBill = options;
		},
		methods: {
			clickBind() {

				var that = this;
				// 允许从相机和相册扫码
				uni.scanCode({
					success: function(res) {

						if (res.result != null) {
							var code = res.result;
							console.log(code.indexOf("JYJD") != 0);
							if (code && code) {
								uni.showLoading({
									title: '绑定中'
								});
								that.codeResult = code;
								that.bindSecurity();
							} else {
								this.$mHelper.toast('无效的二维码！');
							}
						}

					}
				});

			},
			ToggleDelay() {
				this.toggleDelay = true;
				setTimeout(() => {
					this.toggleDelay = false
				}, 1000)
			},
			bindSecurity() {
				var that = this;
				this.$http
					.post(`${bindTructInfo}`, {
						"timeStamp": "20181023131042",
						"sign": "3D8BEB997189B826FCD2D1E080BA7E3D",
						"truckNo": this.truckBill.truckNo,
						"sealNo": this.codeResult
					}).then(async r => {
						console.log(r);
						uni.hideLoading();
						uni.showModal({
							title: '提示',
							content: '绑定成功',
							showCancel:false,
							success: confirmRes => {

							}
						});
					})
					.catch(err => {
						console.log(err);
						this.$mHelper.toast('未识别到检斤信息，请确认您扫查二维码！');
					});
			}
		}

	}
</script>

<style>
	@import "../../colorui/animation.css";
</style>
