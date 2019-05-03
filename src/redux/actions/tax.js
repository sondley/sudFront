import api from "../../api";

export const GET_TAXES = "GET_TAXES";
export const GET_TAXES_SUCCESS = "GET_TAXES_SUCCESS";
export const GET_TAXES_FAIL = "GET_TAXES_FAIL";
export const CREATE_TAX = "CREATE_TAX";
export const CREATE_TAX_SUCCESS = "CREATE_TAX_SUCCESS";
export const CREATE_TAX_FAIL = "CREATE_TAX_FAIL";
export const DELETE_TAX = "DELETE_TAX";
export const DELETE_TAX_SUCCESS = "DELETE_TAX_SUCCESS";
export const DELETE_TAX_FAIL = "DELETE_TAX_FAIL";
export const MODIFY_TAX = "MODIFY_TAX";
export const MODIFY_TAX_SUCCESS = "MODIFY_TAX_SUCCESS";
export const MODIFY_TAX_FAIL = "MODIFY_TAX_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getTaxes() {
	return dispatch => {
		dispatch(requestBegin(GET_TAXES));
		return api
			.requestGET("/impots")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_TAXES_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_TAXES_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_TAXES_FAIL, objError.response));
			});
	};
}

export function createTax(tax, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_TAX));
		return api
			.requestPOST("/impots", {
				nom: tax.nom,
				taxe: tax.taxe
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_TAX_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CREATE_TAX_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_TAX, objError.response));
			});
	};
}

export function modifyTax(tax, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_TAX));
		return api
			.requestPUT(`/impots/${tax._id}`, {
				nom: tax.nom,
				taxe: tax.taxe
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_TAX_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_TAX_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_TAX_FAIL, objError.response));
			});
	};
}

export function deleteTax(taxID, onClose) {
	return dispatch => {
		dispatch(requestBegin(DELETE_TAX));
		return api
			.requestDELETE(`/impots/${taxID}`)
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(DELETE_TAX_SUCCESS, taxID, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(DELETE_TAX_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(DELETE_TAX_FAIL, objError.response));
			});
	};
}
