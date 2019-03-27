import api from "../../api";

export const GET_SOLLICITUDES = "GET_SOLLICITUDES";
export const GET_SOLLICITUDES_SUCCESS = "GET_SOLLICITUDES_SUCCESS";
export const GET_SOLLICITUDES_FAIL = "GET_SOLLICITUDES_FAIL";
export const CREATE_SOLLICITUDE = "CREATE_SOLLICITUDE";
export const CREATE_SOLLICITUDE_SUCCESS = "CREATE_SOLLICITUDE_SUCCESS";
export const CREATE_SOLLICITUDE_FAIL = "CREATE_SOLLICITUDE_FAIL";
export const DELETE_SOLLICITUDE = "DELETE_SOLLICITUDE";
export const DELETE_SOLLICITUDE_SUCCESS = "DELETE_SOLLICITUDE_SUCCESS";
export const DELETE_SOLLICITUDE_FAIL = "DELETE_SOLLICITUDE_FAIL";
export const MODIFY_SOLLICITUDE = "MODIFY_SOLLICITUDE";
export const MODIFY_SOLLICITUDE_SUCCESS = "MODIFY_SOLLICITUDE_SUCCESS";
export const MODIFY_SOLLICITUDE_FAIL = "MODIFY_SOLLICITUDE_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getSollicitudes() {
	return dispatch => {
		dispatch(requestBegin(GET_SOLLICITUDES));
		return api
			.requestGET("/sollicitudes")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_SOLLICITUDES_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_SOLLICITUDES_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_SOLLICITUDES_FAIL, objError.response));
			});
	};
}

export function getSollicitudesByRange(startDate, endDate) {
	return dispatch => {
		dispatch(requestBegin(GET_SOLLICITUDES));
		return api
			.requestPOST("/rangeSollicitudes", {
				start: startDate,
				end: endDate
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_SOLLICITUDES_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_SOLLICITUDES_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_SOLLICITUDES_FAIL, objError.response));
			});
	};
}

export function createSollicitude(sollicitude, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_SOLLICITUDE));
		return api
			.requestPOST("/sollicitudes", {
				idUser: sollicitude.idUser,
				quantite: sollicitude.quantite,
				description: sollicitude.description
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_SOLLICITUDE_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CREATE_SOLLICITUDE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_SOLLICITUDE, objError.response));
			});
	};
}

export function modifySollicitude(sollicitude, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_SOLLICITUDE));
		return api
			.requestPUT(`/sollicitudes/${sollicitude._id}`, {
				idUser: sollicitude.idUser,
				quantite: sollicitude.quantite,
				description: sollicitude.description
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_SOLLICITUDE_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_SOLLICITUDE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_SOLLICITUDE_FAIL, objError.response));
			});
	};
}

export function deleteSollicitude(sollicitudeID, onClose) {
	return dispatch => {
		dispatch(requestBegin(DELETE_SOLLICITUDE));
		return api
			.requestDELETE(`/sollicitudes/${sollicitudeID}`)
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(DELETE_SOLLICITUDE_SUCCESS, sollicitudeID, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(DELETE_SOLLICITUDE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(DELETE_SOLLICITUDE_FAIL, objError.response));
			});
	};
}

export function validateSollicitude(item, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_SOLLICITUDE));
		return api
			.requestPOST("/validerSollicitudes", {
				idUser: item.idUser,
				idSollicitude: item.idSollicitude,
				totalValider: item.totalValider
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_SOLLICITUDE_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_SOLLICITUDE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_SOLLICITUDE_FAIL, objError.response));
			});
	};
}
