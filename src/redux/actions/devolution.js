import api from "../../api";

export const GET_DEVOLUTIONS = "GET_DEVOLUTIONS";
export const GET_DEVOLUTIONS_SUCCESS = "GET_DEVOLUTIONS_SUCCESS";
export const GET_DEVOLUTIONS_FAIL = "GET_DEVOLUTIONS_FAIL";
export const CREATE_DEVOLUTION = "CREATE_DEVOLUTION";
export const CREATE_DEVOLUTION_SUCCESS = "CREATE_DEVOLUTION_SUCCESS";
export const CREATE_DEVOLUTION_FAIL = "CREATE_DEVOLUTION_FAIL";
export const DELETE_DEVOLUTION = "DELETE_DEVOLUTION";
export const DELETE_DEVOLUTION_SUCCESS = "DELETE_DEVOLUTION_SUCCESS";
export const DELETE_DEVOLUTION_FAIL = "DELETE_DEVOLUTION_FAIL";
export const MODIFY_DEVOLUTION = "MODIFY_DEVOLUTION";
export const MODIFY_DEVOLUTION_SUCCESS = "MODIFY_DEVOLUTION_SUCCESS";
export const MODIFY_DEVOLUTION_FAIL = "MODIFY_DEVOLUTION_FAIL";
export const VALIDATE_DEVOLUTION = "VALIDATE_DEVOLUTION";
export const VALIDATE_DEVOLUTION_SUCCESS = "VALIDATE_DEVOLUTION_SUCCESS";
export const VALIDATE_DEVOLUTION_FAIL = "VALIDATE_DEVOLUTION_FAIL";
export const GET_DEVOLUTION_ORDER = "GET_DEVOLUTIONS_ORDER";
export const GET_DEVOLUTION_ORDER_SUCCESS = "GET_DEVOLUTION_ORDER_SUCCESS";
export const GET_DEVOLUTION_ORDER_FAIL = "GET_DEVOLUTION_ORDER_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getDevolutions() {
	return dispatch => {
		dispatch(requestBegin(GET_DEVOLUTIONS));
		return api
			.requestGET("/devolutions")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_DEVOLUTIONS_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_DEVOLUTIONS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_DEVOLUTIONS_FAIL, objError.response));
			});
	};
}

export function getOrderByNumber(numero) {
	return dispatch => {
		dispatch(requestBegin(GET_DEVOLUTION_ORDER));
		return api
			.requestPOST("/numeroOrden", {
				numero
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_DEVOLUTION_ORDER_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_DEVOLUTION_ORDER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_DEVOLUTION_ORDER_FAIL, objError.response));
			});
	};
}

export function createDevolution(item, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_DEVOLUTION));
		return api
			.requestPOST("/devolutions", {
				numero: item.numero,
				client: item.client,
				idRealisateur: item.idRealisateur,
				arrayOrden: item.arrayOrden
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_DEVOLUTION_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CREATE_DEVOLUTION_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_DEVOLUTION, objError.response));
			});
	};
}

export function modifyDevolution(item, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_DEVOLUTION));
		return api
			.requestPUT(`/devolutions/${item._id}`, {
				numero: item.numero,
				client: item.client,
				idRealisateur: item.idRealisateur,
				arrayOrden: item.arrayOrden
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_DEVOLUTION_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_DEVOLUTION_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_DEVOLUTION_FAIL, objError.response));
			});
	};
}

export function deleteDevolution(itemID, onClose) {
	return dispatch => {
		dispatch(requestBegin(DELETE_DEVOLUTION));
		return api
			.requestDELETE(`/devolutions/${itemID}`)
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(DELETE_DEVOLUTION_SUCCESS, itemID, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(DELETE_DEVOLUTION_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(DELETE_DEVOLUTION_FAIL, objError.response));
			});
	};
}

export function validateDevolution(item, onClose) {
	return dispatch => {
		dispatch(requestBegin(VALIDATE_DEVOLUTION));
		return api
			.requestPOST("/validateDevolution", {
				idUser: item.idUser,
				idDevolution: item.idDevolution
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(VALIDATE_DEVOLUTION_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(VALIDATE_DEVOLUTION_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(VALIDATE_DEVOLUTION_FAIL, objError.response));
			});
	};
}
