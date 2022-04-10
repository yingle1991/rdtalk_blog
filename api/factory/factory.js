import { http } from '@/utils/request';

const factoryList="/app-api/vehicle/factory/factoryList";

// 手机号 + 密码登陆+微信code 登录之后绑定
export function getFactoryList() {
   return http
  	.get(`${factoryList}`);
}