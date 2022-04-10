import { http } from '@/utils/request';
import indexConfig from '@/config/index.config';
const postList="/api/posts/";
const postDetail="/api/articles/";

export function getPostList(page) {
   return http
  	.get(indexConfig.blogUrl+`${postList}`+`${page}`+".json");
}

// 获取指定的文章详情数据
export function getArticleDetail(e) {
   return http
  	.get(indexConfig.blogUrl+`${postDetail}`+`${e}`+".json");
}