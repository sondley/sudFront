import api from "../../api";

export const GET_BUYS = "GET_BUYS";
export const GET_BUYS_SUCCESS = "GET_BUYS_SUCCESS";
export const GET_BUYS_FAIL = "GET_BUYS_FAIL";
export const CREATE_BUY = "CREATE_BUY";
export const CREATE_BUY_SUCCESS = "CREATE_BUY_SUCCESS";
export const CREATE_BUY_FAIL = "CREATE_BUY_FAIL";
export const DELETE_BUY = "DELETE_BUY";
export const DELETE_BUY_SUCCESS = "DELETE_BUY_SUCCESS";
export const DELETE_BUY_FAIL = "DELETE_BUY_FAIL";
export const MODIFY_BUY = "MODIFY_BUY";
export const MODIFY_BUY_SUCCESS = "MODIFY_BUY_SUCCESS";
export const MODIFY_BUY_FAIL = "MODIFY_BUY_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getBuys() {
	return dispatch => {
		dispatch(requestBegin(GET_BUYS));
		return api
			.requestGET("/achats")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_BUYS_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_BUYS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_BUYS_FAIL, objError.response));
			});
	};
}

export function getBuysByRange(startDate, endDate) {
	return dispatch => {
		dispatch(requestBegin(GET_BUYS));
		return api
			.requestPOST("/rangeAchats", {
				start: startDate,
				end: endDate
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_BUYS_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_BUYS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_BUYS_FAIL, objError.response));
			});
	};
}

export function createBuy(buy, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_BUY));
		return api
			.requestPOST("/achats", {
				idProvider: buy.idProvider,
				idUser: buy.idUser,
				arrayAchat: buy.arrayAchat
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_BUY_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CREATE_BUY_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_BUY, objError.response));
			});
	};
}

export function modifyBuy(buy, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_BUY));
		return api
			.requestPUT(`/achats/${buy._id}`, {
				idProvider: buy.idProvider,
				idUser: buy.idUser,
				arrayAchat: buy.arrayAchat
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_BUY_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_BUY_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_BUY_FAIL, objError.response));
			});
	};
}

export function deleteBuy(buyID, onClose) {
	return dispatch => {
		dispatch(requestBegin(DELETE_BUY));
		return api
			.requestDELETE(`/achats/${buyID}`)
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(DELETE_BUY_SUCCESS, buyID, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(DELETE_BUY_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(DELETE_BUY_FAIL, objError.response));
			});
	};
}

export function validateBuy(item, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_BUY));
		return api
			.requestPOST("/validateAchat", {
				idUser: item.idUser,
				idAchat: item.idAchat,
				transportFrais: parseInt(item.transportFrais),
				autres: parseInt(item.autres),
				montant: parseInt(item.montant),
				rabais: parseInt(item.rabais)
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_BUY_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_BUY_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_BUY_FAIL, objError.response));
			});
	};
}
