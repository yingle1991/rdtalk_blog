<template>
	<view class="plate-number-keyboard-box" v-if="showKeyboard" @tap.stop>
		<view class="pnk-main" :animation="animationData">
			<view class="pnk-main-title">
				<text>请点击选择车牌号</text>
				<view class="xiala" @tap="_closeKeyboard"></view>
			</view>
			<view class="pnk-content">
				<!-- 省份面板 -->
				<view class="province-plane" v-if="showProvince">
					<block v-for="(item, index) in provinceList" :key="index">
						<view class="line">
							<view v-if=" index === 'line4' " class='number-item handle-btn' @tap='_clickChangePlane'>ABC</view>
							<view class="number-item" :class=" (cursor === 0 && index === 'line4' && ind >= 2) || (cursor >= 6 && (index !== 'line4' || (index === 'line4' && ind < 2))) ? 'disabled' : '' "
							 v-if=" !((cursor === 0 && index === 'line4' && ind > 7) || (cursor >= 6 && index === 'line4' && ind < 2)) "
							 v-for="(it, ind) in item" :key="ind" :data-text='it' :data-disabled=" (cursor === 0 && index === 'line4' && ind >= 2) || (cursor >= 6 && (index !== 'line4' || (index === 'line4' && ind < 2))) "
							 @tap='_handleClick'>{{it}}</view>
							<view v-if=" index === 'line4' " class='number-item handle-btn delete-btn' @tap='_handleDelete'></view>
						</view>
					</block>
				</view>
				<!-- 字母数字面板 -->
				<view class='letter-number-plane' v-if=" !showProvince ">
					<block v-for="(item, index) in letterNumberList" :key="index">
						<view class='line'>
							<view v-if="index === 'line4' && cursor === 0" class='number-item handle-btn' @tap='_clickChangePlane'>省</view>
							<view v-if="index === 'line4' && cursor > 0" class="number-item handle-btn" :class=" cursor < 6 ? 'disabled' : '' "
							 :data-disabled="cursor < 6" @tap='_clickChangePlane'>字</view>
							<view class="number-item" :class=" index === 'line2' && (it === 'I' || it === 'O') ? 'disabled' : '' " :data-disabled=" index === 'line2' && (it === 'I' || it === 'O') "
							 v-for="(it, ind) in item" :key="ind" :data-text='it' @tap='_handleClick'>{{it}}</view>
							<view v-if=" index === 'line4' " class='number-item handle-btn delete-btn' @tap='_handleDelete'></view>
						</view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			cursor: {
				type: Number,
				default: 0,
			}
		},
		data() {
			return {
				showKeyboard: false, // 是否显示键盘
				provinceList: {
					line1: ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '苏'],
					line2: ['浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '琼'],
					line3: ['川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '新'],
					line4: ['藏', '使', '领', '警', '学', '挂', '港', '澳', '试', '超', '军']
				},
				letterNumberList: {
					line1: [1, 2, 3, 4, 5, 6, 7, 8, 9, '0'],
					line2: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
					line3: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
					line4: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
					// line5: ['领', '警', '学', '挂', '港', '澳', '试', '超', '军']
				},
				showProvince: true, // 是否显示省份面板，控制省份面板和字符面板显示
				animationData: {} // 键盘动画
			};
		},
		watch: {
			cursor(val) {
				this.showProvince = (val === 0);
			},
		},
		created() {
			this.showProvince = (this.cursor === 0);
		},
		methods: {
			show() {
				this.showKeyboard = true;
				
				const animation = uni.createAnimation({
					duration: 200,
				});
				// 立即执行无效，延迟一段时间执行弹出动画
				setTimeout(() => {
					animation.translateY(0).step();
					this.animationData = animation.export();
					this.$emit('onShow');
				}, 100);
			},
			hide() {
				const animation = uni.createAnimation({
					duration: 200
				})
				setTimeout(() => {
					animation.translateY(300).step();
					this.animationData = animation.export();
					setTimeout(() => {
						this.showKeyboard = false;
					}, 300);
					this.$emit('onHide');
				}, 100);
			},
			/**
			 * 键盘面板切换操作，控制省份内容和字符内容显示
			 */
			_clickChangePlane: function(e) {
				if (e.currentTarget.dataset.disabled) {
					return;
				}
				this.showProvince = !this.showProvince
			},
			/**
			 * 关闭键盘，将键盘隐藏
			 */
			_closeKeyboard: function(e) {
				// 创建动画，执行键盘面板退出动画，动画结束后隐藏整个键盘组件
				this.hide();
			},

			/**
			 * 键盘主要键点击事件，将点击内容更新到plateNumber
			 */
			_handleClick: function(e) {
				// 如果当前显示的省份面板，当即任意省份后，自动切换到字符面板，同时将结果值的第一个字符修改
				if (e.currentTarget.dataset.disabled) {
					return;
				}
				if (this.showProvince) {
					this.showProvince = false;
				}
				if (this.cursor === 7) {
					this.hide();
				}
				this.$emit('onInput', e.currentTarget.dataset.text);
			},
			_handleCursor: function(e) {
				console.log(e.currentTarget.dataset.index)
				this.cursor = e.currentTarget.dataset.index;
			},
			/**
			 * 删除回退点击事件
			 */
			_handleDelete: function() {
				this.$emit('onDel');
			},
		},
	}
</script>

<style scoped>
	button {
		padding: 0rpx;
	}

	.plate-number-keyboard-box {
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		width: 100%;
		height: 432rpx;
		overflow: hidden;
		background: rgba(255, 255, 255, 0);
		z-index: 9999;
	}

	.pnk-main {
		position: absolute;
		bottom: 0;
		left: 0rpx;
		height: 432rpx;
		width: 100%;
		background: #d0d5d9;
		transform: translateY(432rpx);
		color: #333333;
	}

	.pnk-main .pnk-main-title {
		font-size: 24rpx;
		height: 50rpx;
		line-height: 50rpx;
		color: #333;
		border-bottom: 1rpx solid #ddd;
		padding: 0rpx 10rpx;
		overflow: hidden;
	}

	.pnk-main-title text {
		float: left;
	}

	.pnk-main-title .xiala {
		position: relative;
		float: right;
		width: 70rpx;
		height: 50rpx;
		font-size: 40rpx;
		text-align: center;
		color: #333;
	}

	.pnk-content {
		padding: 10rpx;
	}

	.line {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-bottom: 14rpx;
	}

	.line:last-of-type {
		margin-bottom: 0rpx;
	}

	.line .number-item {
		width: 60rpx;
		height: 80rpx;
		border-radius: 12rpx;
		text-align: center;
		line-height: 80rpx;
		background: #fff;
		font-size: 30rpx;
	}

	.line .number-item.disabled {
		background: #ccc !important;
		color: #999 !important;
	}

	.line .number-item:active {
		background: #eee;
	}

	.line .handle-btn {
		width: 80rpx;
		background: #acb3bb;
		font-size: 28rpx;
	}
	
	.xiala::after {
		content: '';
		position: absolute;
		left: calc(50% - 14rpx);
		top: calc(50% - 8rpx);
		width: 28rpx;
		height: 28rpx;
		background-size: 100%;
		background-repeat: no-repeat;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAsCAMAAADFL88lAAAAclBMVEUAAAADGyYDGyYAADUDGyYAKjMAKysAIiIDGyYDGyYDGyYDGiYDGyYDGyYDGiYDGiUCGiYDGyYDGyYDGyUEGyYDGyYDGiUCGyYDGyUEGyUCGiUAGCYDGyYDGyYCGiUAGCQDHCYDGiUCHCcDHCcDGyYDHSnHUSRaAAAAJHRSTlMA/fsD+AUGB7yzubatqaSdf6+XkYvcwczGhHoK8udqDmVLb1ulZTqDAAACG0lEQVRIx6XV6WLCIAwA4AAF6rGtHvWaO9zg/V9xIVaMomuh+VWRfhBIAUA17bHdW9AwIjSYfVu1DSK69s45v/0CW+5Z+NoRUyto/FE6WfntO4ml3tZXyBx9A62TDqNYJO8dvaAI9wH0QOLOgi30dsEjUUCLLD1WfmPA5HuGvDMicYaHiFdhSXX+/troYZoHgBp/losazIYBU2xSscFRg87z9OY2RWxSNRNnACZn/dSdp0Kj5uIkQ7Q0Ge4ZaiYxVs8CxaEeTNmLUwWWDSTjQC+D1pGGncXUJHnxLy5K/zpApC4T7t0kpmP1kPgGoAZ48+srSXmoVMzwsDjiC0ycZojovTBvknSneuTi8onIPcc8/bCoZqnY7z0vNBvKQEZxdRVT75V1XNCrz8WuDoRfo9jnOe6lYfgchd9zkXtvfH7/Fq1ixS87MfWWzJtTl8Fi86i8VmdP4H50Xo84ScTEY599/yd1Lyp1463RyztGbBRFEA8kMk9grvEQMQADRXm5xkjknnQuz6NuXPxBsdyj0LfiJ4p3nkAv2Y/eveZiIPdedPUio5chLpj4DUZBc/FkPN6KRHEW4XDJV1Y5Ht+ZORN/P4Mn4vGrITtsEOVFxOg8gV4YbrQY93cZvaKshegg5mkoDBXneNauV0OxyC43+rSv3niR6m9V5KUXnOQX18gwdCVVQlTk0X6MFtfeO+dTr3wdT5vjR30alO8fxlZei+kmmyYAAAAASUVORK5CYII=);
	}
	
	.delete-btn {
		position: relative;
	}
	.delete-btn::after {
		content: '';
		position: absolute;
		left: calc(50% - 18rpx);
		top: calc(50% - 15rpx);
		width: 36rpx;
		height: 36rpx;
		background-size: 100%;
		background-repeat: no-repeat;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAvCAMAAACIYFl1AAAAk1BMVEUAAAADGyYAHCsAHh8DGyUDHCYDGyYAHykDGycDGyYDGyYAHSYEGiUAHCcDGyYCGyYEGyYAFCoCGyYDGyYCGiYDGyYDGyYEGSYFGyUDGyYDGyUDGiYCGycCGyYCGiYDGiYDGiUAHCgDGyYDGiYEGyQFGiUDGyYDGyYEGyUDGyUAHSQDGyYAGiUDGyUDGyYDGyYDHCi5/q4pAAAAL3RSTlMA+gQI/En3GeFj8RFFItl8QgzN49S+Wjs06LKSd3JrV00q3rg5L8aah1IX6x2splBDDs0AAAJiSURBVEjHrZaNdvIgDIYDxTptrbbz/3/qpvPbRu7/6j4Sh7Ht2VnpGdtRAzzkBQIEHosG2GTKNin94wgqrD4i2mYFcVOBzxgbo/jfFyW/lPJVylhlMAUpEaTsFpsUa2M8lkSP0TjWWPfnfvgvSx/++7uRq/qPji/oGnE123d+KfvRdEF+Hth5jMZgAU2KPqASWANMyLYnSKJbyaOfSgKDZ4HJ8caJVniByA+na+703VP3iWHPvvxDpTDToO8dK7TURB729Z/OUpgKO1x7yhPDIbfW4SlaE+MZtK/oIfbIEtbXCOzncMBY4SLxjuHdosUdaGF3VPMOugyTvcLYid7d2ZGlwWwqs0wNKoM4Al2FUxb9CXe4W/ASmJnXOe9zRXatwBqigvz0ByB7kYxdq8F4DtrvhWMPSVk2WUMWvS0tLYcBjxhpbyw+mC3Br5ZET3R5cV9vQp+6QDJo9PilslUclyRascBH+hQzneX6jVlFC1CFt9x0qUZUDh3L835bcgdZeoFhEJPoIhfWd6HIId/EWpxKB4GXJBo79wNRCSpjFQ+wBV2HeyxtJaJLR2H9fZWYNVk1OEOlaDvzOku+CurktoII+EPPMud9qznDB6/2OAla7fb7XI8wcwqKMIlt0za25VRtQk+VnGcaOPQ8+1uHhC9b3CRyh/Va3GHOvmZ8EV3Db09uQhL+5eGAe5uqvnhO+6AXQ7ZmQXN6zoPfKra3TriiByf4lSTkSDaOgt5niUfODLKwzEAWhHOS8ykkJxHhRXg2JK5nNjgPE5qi9JbgBWSAksZN2uSekvWOG2a9yxnAf+zPn543ZzPrAAAAAElFTkSuQmCC);
	}
</style>
