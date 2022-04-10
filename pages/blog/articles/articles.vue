<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">文章详情</block>
		</cu-custom>
		<block v-if="isLoding">
		  <view class="articles_wrap">
		  <view class="hd_wrap">
		    <view class="title_w">{{htmlText.title}}</view>
		    <view class="ic">
		          <view class="img_a">
		      <image class="" :src="author_d.img" mode="widthFix"></image>
		    </view>
		    <view class="author_w">
		      <view class="author_t"><text class="tag">博主</text>{{author_d.name}}</view>
		      <view class="date_w">{{dateUtil.timeChange(htmlText.date)}}
		        <block v-if="htmlText.categories.length!==0">
		          <text class="cates_i" v-for="(item,index) in htmlText.categories" :key="index" >{{item.name}}</text>
		        </block>
		      </view>
		    </view>
		    </view>
		  </view>
		<mp-html :content="htmlText.content" preview-img />
		<view class="footer_copyright">
		  <view class="item_f"><text>文章作者:</text>{{author_d.name}}</view>
		  <view class="item_f"><text>文章链接:</text><text class="nav_a" bindtap="Nav_a" data-con="1">{{"https://"+author_d.domain}}</text></view>
		  <view class="item_f"><text>版权声明:</text>本博客所有文章除特别声明外，均采用 <text class="nav_a" bindtap="Nav_a" data-con="2">CC BY-NC-SA 4.0</text> 许可协议。转载请注明来自{{author_d.webname}}</view>
		</view>
		</view>
		</block>
		<block v-else>
		  <view class="loding_w"></view>
		</block>
	</view>
</template>

<script>
	import {
		getArticleDetail
	} from '@/api/blog/blog.js'
	import mpHtml from '@/components/mp-html/mp-html'
	export default {
		components: {
		 mpHtml
		},
		data() {
			return {
				 isLoding: false,
				htmlText: '',
				author_d: {}
			}
		},
		onLoad(options) {
			let { id } = options;
			if (options !== null) {
			      this.getDetail(id)
			    }
		},
		methods: {
			getDetail(id){
				const postListPromise = getArticleDetail(id);
				postListPromise.then(res => {
					
					            this.htmlText= res;
					            this.author_d={
					              name: "乐子",
					              img: "../../../static/icon/default-avatar.png",
					              domain: "www.rdtalk.cn",
					              webname: "博客"
					            };
					            this.isLoding= true;
				}).catch(errors => {
					console.log(errors);
				}).finally(() => {
					
				
				})
			}
		}
	}
</script>

<style>
/*
 * @Description: 文章详情页美化
 * @Author: Harry
 * @Date: 2021-09-04 21:53:28
 * @Url: https://u.mr90.top
 * @github: https://github.com/rr210
 * @LastEditTime: 2021-09-08 20:51:04
 * @LastEditors: Harry
 */
page {
  background-color: #f5f5f5;
}
.articles_wrap {
  margin: 20rpx;
  padding: 18rpx;
  border-radius: 20rpx;
  background-color: #fff;
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.06);
  animation: fadeIn 1s linear;
}
.articles_wrap .hd_wrap .title_w {
  font-size: 40rpx;
  font-weight: 550;
  text-align: center;
  padding: 20rpx 0 50rpx 0;
}
.articles_wrap .ic {
  display: flex;
  padding-bottom: 20rpx;
  border-bottom: 3rpx solid #ccc;
}
.articles_wrap .ic .img_a {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.articles_wrap .ic .img_a image {
  width: 60%;
  border-radius: 50%;
}
.articles_wrap .ic .author_w {
  flex: 5;
  font-size: 23rpx;
}
.articles_wrap .ic .author_w .author_t text {
  padding: 0 8rpx;
  background: var(--articeTag);
  color: var(--articleThemeColor);
  border-radius: 4rpx;
}
.articles_wrap .ic .author_w .date_w {
  padding: 10rpx 4rpx;
  color: #909399;
}
.articles_wrap .ic .author_w .date_w .cates_i {
  padding: 0 4rpx;
  margin: 0 4rpx;
  border-radius: 4rpx;
  background: var(--articeTag);
  color: var(--articleThemeColor);
}
.loding_w {
  position: relative;
  margin: 0 auto;
  margin-top: calc(50vh - 234rpx);
  width: 568rpx;
  height: 468rpx;
  background: url(https://cdn.jsdelivr.net/gh/Rr210/image@master/hexo/api/xiaodianshi2_l.gif) no-repeat;
  background-size: 100% 100%;
}
.loding_w::after {
  content: '正在拼命加载中~_~';
  position: absolute;
  bottom: -20rpx;
  width: 277rpx;
  height: 40rpx;
  left: calc(50% - 150rpx);
}
.footer_copyright {
  background-color: #f2f6fc;
  padding: 20rpx;
  font-size: 26rpx;
  margin-top: 40rpx;
  border-radius: 20rpx;
  position: relative;
}
.footer_copyright::after {
  content: '©';
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  color: var(--articleThemeColor);
}
.footer_copyright .item_f text {
  padding-right: 5rpx;
  font-size: 26rpx;
  color: var(--articleThemeColor);
}
.footer_copyright .item_f .nav_a {
  color: #2e2e97;
  text-decoration: underline;
}

</style>
