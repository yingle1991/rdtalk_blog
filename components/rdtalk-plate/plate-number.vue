<template>
	<view class="plate-number">
		<view class="plate-number-box" :class=" plate[7] && 'green' " @tap.stop>
			<label :id=" 'input' + index " :class=" (index == cursor && focus ? 'focus' : '') + (index === 7 && !plate[index] ? ' xinnengyuan' : '') "
			 v-for="(item, index) in 8" :data-index="index" :key="index" @tap='_handleCursor'>{{plate[index] || ''}}</label>
		</view>

		<plate-keyboard ref='plateKeyboard' :cursor="cursor" @onInput="_keyboardInput" @onDel="_keyboardDel" @onShow="plateKeyboardOnShow" @onHide="plateKeyboardOnHide" />
	</view>
</template>

<script>
	import PlateKeyboard from './plate-keyboard.vue';

	export default {
		components: {
			PlateKeyboard
		},
		data() {
			return {
				plate: new Array(8),
				cursor: 0,
				focus: false,
			}
		},
		created() {
			// 根据IP获取到当前省份
			this.getLocationByIP();
		},
		methods: {
			setPlate: function(plateNumber) {
				const plate = plateNumber.split('');
				while (plate.length < 8) {
					plate.push('');
				}
				this.plate = plate;
				this.cursor = plateNumber.length;
				this.focus = false;
			},
			getPlate: function() {
				return this.plate.join('');
			},
			onInput: function(text) {
				// 车牌号最多8位，大多数7位，新能源8位，控制不能超过8位数
				if (this.cursor < 8) {
					this.plate.splice(this.cursor++, 1, text);
				}
			},
			onDel: function() {
				if (this.plate[this.cursor]) {
					this.plate.splice(this.cursor, 1, '');
				} else if (this.cursor > 0) {
					this.plate.splice(--this.cursor, 1, '');
				}
			},
			_handleCursor: function(e) {
				let index = parseInt(e.currentTarget.dataset.index);
				for (; index > 0 && !this.plate[index] && !this.plate[index - 1]; index--);

				this.cursor = index;
				this.focus = true;

				this.$refs.plateKeyboard.show();
			},

			hidePlateKeyboard() {
				this.$refs.plateKeyboard.hide();
			},
			_keyboardInput(val) {
				console.log('===input：' + val);
				this.onInput(val);
			},
			_keyboardDel() {
				console.log('===del')
				this.onDel();
			},
			plateKeyboardOnShow() {
				this.$emit('plateKeyboardOnShow');
			},
			plateKeyboardOnHide() {
				this.focus = false;
				this.$emit('plateKeyboardOnHide');
			},

			async getLocationByIP() {
				if (getApp().globalData.provinceShort) {
					this.setPlate(getApp().globalData.provinceShort);
				} else {
					if (!this.$Request) {
						return;
					}
					
					const res = await this.$Request(this.$Api.general.park.getLocationByIP, {});
					if (res.success) {
						var prov = res.data.province;
						if (prov) {
					        let provShort = this.provinceForShort(prov);
							if (provShort) {
								getApp().globalData.provinceShort = provShort;
								if (!this.getPlate()) {
									this.setPlate(provShort);
								}
							}
						}
					}
				}
			},
			provinceForShort(province) {
				if (province == "北京市")
					return "京";
				else if (province == "天津市")
					return "津";
				else if (province == "重庆市")
					return "渝";
				else if (province == "上海市")
					return "沪";
				else if (province == "河北省")
					return "冀";
				else if (province == "山西省")
					return "晋";
				else if (province == "辽宁省")
					return "辽";
				else if (province == "吉林省")
					return "吉";
				else if (province == "黑龙江省")
					return "黑";
				else if (province == "江苏省")
					return "苏";
				else if (province == "浙江省")
					return "浙";
				else if (province == "安徽省")
					return "皖";
				else if (province == "福建省")
					return "闽";
				else if (province == "江西省")
					return "赣";
				else if (province == "山东省")
					return "鲁";
				else if (province == "河南省")
					return "豫";
				else if (province == "湖北省")
					return "鄂";
				else if (province == "湖南省")
					return "湘";
				else if (province == "广东省")
					return "粤";
				else if (province == "海南省")
					return "琼";
				else if (province == "四川省")
					return "川";
				else if (province == "贵州省")
					return "贵";
				else if (province == "云南省")
					return "云";
				else if (province == "陕西省")
					return "陕";
				else if (province == "甘肃省")
					return "甘";
				else if (province == "青海省")
					return "青";
				else if (province == "台湾省")
					return "台";
				else if (province == "内蒙古自治区")
					return "蒙";
				else if (province == "广西壮族自治区")
					return "桂";
				else if (province == "宁夏回族自治区")
					return "宁";
				else if (province == "新疆维吾尔自治区 ")
					return "新";
				else if (province == "西藏自治区")
					return "藏";
				else if (province == "香港特别行政区")
					return "港";
				else if (province == "澳门特别行政区")
					return "澳";
				else return '';
			}
		},
	}
</script>

<style scoped>
	.plate-number-box {
		position: relative;
		width: 420rpx;
		height: 50rpx;
		padding: 24rpx;
		background: #2d66d8;
		box-sizing: content-box;
		margin: auto;
		border-radius: 10rpx;
		transition: all 1s;
	}

	.plate-number-box::before {
		content: '';
		border: 2rpx solid #fff;
		position: absolute;
		top: 5rpx;
		left: 5rpx;
		width: 456rpx;
		border-radius: 10rpx;
		height: 86rpx;
	}

	.plate-number-box::after {
		content: '·';
		position: absolute;
		left: 122rpx;
		top: 30rpx;
		color: #fff;
		font-size: 50rpx;
		line-height: 40rpx;
	}

	.plate-number-box.green {
		background: linear-gradient(#f8f8f8 20%, #16b235);
		box-shadow: 0 0 4rpx 0 #ebebeb;
	}

	.plate-number-box.green::before {
		border: 2rpx solid #000;
	}

	.plate-number-box.green::after {
		content: '';
		position: absolute;
		left: 120rpx;
		top: 36rpx;
		width: 26rpx;
		height: 26rpx;
		background-size: 100%;
		background-repeat: no-repeat;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAF6UExURUdwTH3EyJfLtffOk9mwguW7jHvftPvQofnPoVlKOYzOo4jMs5HPp5fIvqbYnOhFQfrCkJG6pIbLw4vUzYjKv5vjs9q8JvLPn4bJpJHqtYrNqnStopDh3oLJwViHcIjLv3q2qozMvmRYSYfLpovMqm6ggum9j+PMnqDSuqTQuOjOpKPOoGaZfnGqi+DCKXooHt20hqWvqW9fEMt9bKG7p8LDXnuSiKS4o////zqp4Deo4jCuMS2tLfTz8+vr7OUUW9rZ22JbUvv8/Uuy2zGxMUO2SiaZJ9DhLjdEOkpPTckubzSj2lu62VO+YDJERD9NR/f290JFQbe1tV3BbuLg4d/c3bXXLzIxJ1dVUj1OVnHF0W3IhMXCwSlMXhlAGiZOJ8zhL0ZiUVdfW7mGmU1aVqakpZiWlyNGV2mnp4KBgkpybhg9UTKh2bbWKmlnZLDcfbrcMWeofoOMGaa3IzpLVFx3GcngQ9wzaa/chHoJLK0NRGEiRWppaD1PV9NqRZ0AAAA4dFJOUwATR/X49w/6+v3hs3ByFPT09uNHzUf0+Swpy+YuL+Xw1f398P3c9/f98Pu6yMb0+vjc+vi5+NyxP0I0ygAAAWxJREFUKM910ldXwjAYBuC0KgqlVeZhKEPAhXuGKYIIKKscNsjGvff87yZNOdYLn8v3bZKTLwWAoGjGardbGQ0FpChWXU1GkOSZjZVUU9pqxOvxeL0e72X8Qjs5yDXqJMqI4/p52qwRv1dHBjEq8jCXNgtrKG1SyI+wq9MChPW0TYYKtnuIfaa/K5XKUyIIITzpsWjB2usu8v4VDGBZlMNsYpsDdBfnH3wgLICCfocGmxvjyEpJTpTxVjCU2QHzs0PYiEgewkWgpwJzC2PYqGg6RA75pwiXVWirCWRmdZggWwXRCveWXq9fXi/tETfi4W5Av8VardgjH4QS/bYOcIqXGPJQllwQdlwcAMrb62KxePdcimPCSHIZJZqVzJTy+3y+/QNBAw0xn1nEQwQGRVRoMF8zDwsJi5E8CK1I+XGF+JuhPm/RDZ7QYKpF/USDby8Zfx9dplTUUlEkde9Syv78JxzNOJxOB6PjxOAHI6di/dhTK/cAAAAASUVORK5CYII=);
	}

	.plate-number-box.green label {
		color: #222;
		text-shadow: 0 0 2rpx #fff;
	}

	.plate-number-box label {
		position: relative;
		vertical-align: middle;
		display: inline-block;
		width: 50rpx;
		color: #fff;
		text-align: center;
		font-size: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-shadow: 0rpx 0rpx 2rpx #000;
	}

	.plate-number-box label:nth-child(2) {
		margin-right: 20rpx;
	}

	.plate-number-box label:last-child {
		content: "\e63f";
	}

	.plate-number-box label.focus::after {
		content: '';
		position: absolute;
		bottom: -6rpx;
		left: 5%;
		width: 90%;
		height: 4rpx;
		background: #fff;
		animation: cursor 1s ease-in infinite;
	}
	
	.plate-number-box label.xinnengyuan::before {
		content: '';
		position: absolute;
		left: 12%;
		top: 12%;
		width: 76%;
		height: 76%;
		background-size: 100%;
		background-repeat: no-repeat;
		background-image: url(data:image/png;base64,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);
	}

	@keyframes cursor {
		from {
			opacity: 1;
		}

		to {
			opacity: 0.2;
		}
	}
</style>
