import api from "../../api";

export const GET_PAYMENTS = "GET_PAYMENTS";
export const GET_PAYMENTS_SUCCESS = "GET_PAYMENTS_SUCCESS";
export const GET_PAYMENTS_FAIL = "GET_PAYMENTS_FAIL";
export const CREATE_PAYMENT = "CREATE_PAYMENT";
export const CREATE_PAYMENT_SUCCESS = "CREATE_PAYMENT_SUCCESS";
export const CREATE_PAYMENT_FAIL = "CREATE_PAYMENT_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getPayments() {
	return dispatch => {
		dispatch(requestBegin(GET_PAYMENTS));
		return api
			.requestGET("/getPaiements")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_PAYMENTS_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_PAYMENTS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_PAYMENTS_FAIL, objError.response));
			});
	};
}

export function createPayment(payment, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_PAYMENT));
		return api
			.requestPOST("/paiements", {
				idRealisateur: payment.idRealisateur
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_PAYMENT_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CREATE_PAYMENT_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_PAYMENT, objError.response));
			});
	};
}
