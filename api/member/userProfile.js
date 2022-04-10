import { http } from '@/utils/request';

const userInfo="/app-api/member/user/get";
// 获得用户的基本信息
export function getUserInfo() {
  return http
    	.get(`${userInfo}`);
}

// // 修改
// export function updateNickname(nickname) {
// 	return request({
// 		url: 'member/user/profile/update-nickname',
// 		method: 'post',
// 		header: {
// 			"Content-Type": "application/x-www-form-urlencoded"
// 		},
// 		data: {
// 			nickname
// 		}
// 	})
// }