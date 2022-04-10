import { http } from '@/utils/request';
const Login="/app-api/member/social-login3";
// 手机号 + 密码登陆+微信code 登录之后绑定
export function login(mobile, password,code) {
	console.log("laile");
	console.log(http);
   return http
  	.post(`${Login}`, {
  	  "username": mobile,
  	  "password": password,
	  "appid":"wx8cd96d16db576fa3",
  	  "code": code,
	  "type":"33",
	  "state":"1"
  	});
}

// // 手机号 + 验证码登陆
// export function smsLogin(mobile, code) {
//   return request({
//     url: 'sms-login',
//     method: 'post',
//     data: {
// 		mobile, code
// 	}
//   })
// }

// // 发送手机验证码
// export function sendSmsCode(mobile, scene) {
// 	return request({
// 	  url: 'send-sms-code',
// 	  method: 'post',
// 	  data: {
// 			mobile, scene
// 		}
// 	})
// }