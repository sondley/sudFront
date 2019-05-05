import api from "../../api";

export const GET_NOTIFICATIONS = "GET_NOTIFICATIONS";
export const GET_NOTIFICATIONS_SUCCESS = "GET_NOTIFICATIONS_SUCCESS";
export const GET_NOTIFICATIONS_FAIL = "GET_NOTIFICATIONS_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getNotifications() {
	return dispatch => {
		dispatch(requestBegin(GET_NOTIFICATIONS));
		return api
			.requestGET("/getNotifications")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_NOTIFICATIONS_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_NOTIFICATIONS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_NOTIFICATIONS_FAIL, objError.response));
			});
	};
}
