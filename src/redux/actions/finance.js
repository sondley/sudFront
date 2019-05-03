import api from "../../api";

export const GET_FINANCES = "GET_FINANCES";
export const GET_FINANCES_SUCCESS = "GET_FINANCES_SUCCESS";
export const GET_FINANCES_FAIL = "GET_FINANCES_FAIL";
export const CREATE_FINANCE = "CREATE_FINANCE";
export const CREATE_FINANCE_SUCCESS = "CREATE_FINANCE_SUCCESS";
export const CREATE_FINANCE_FAIL = "CREATE_FINANCE_FAIL";
export const DELETE_FINANCE = "DELETE_FINANCE";
export const DELETE_FINANCE_SUCCESS = "DELETE_FINANCE_SUCCESS";
export const DELETE_FINANCE_FAIL = "DELETE_FINANCE_FAIL";
export const MODIFY_FINANCE = "MODIFY_FINANCE";
export const MODIFY_FINANCE_SUCCESS = "MODIFY_FINANCE_SUCCESS";
export const MODIFY_FINANCE_FAIL = "MODIFY_FINANCE_FAIL";
export const GET_ALL_DATA = "GET_ALL_DATA";
export const GET_ALL_DATA_SUCCESS = "GET_ALL_DATA_SUCCESS";
export const GET_ALL_DATA_FAIL = "GET_ALL_DATA_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getFinances() {
	return dispatch => {
		dispatch(requestBegin(GET_FINANCES));
		return api
			.requestGET("/actifPasifs")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_FINANCES_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_FINANCES_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_FINANCES_FAIL, objError.response));
			});
	};
}

export function createFinance(finance, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_FINANCE));
		return api
			.requestPOST("/actifPasifs", {
				description: finance.description,
				type: finance.type,
				montant: finance.montant
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_FINANCE_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CREATE_FINANCE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_FINANCE, objError.response));
			});
	};
}

export function modifyFinance(finance, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_FINANCE));
		return api
			.requestPUT(`/actifPasifs/${finance._id}`, {
				description: finance.description,
				type: finance.type,
				montant: finance.montant
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_FINANCE_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_FINANCE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_FINANCE_FAIL, objError.response));
			});
	};
}

export function deleteFinance(financeID, onClose) {
	return dispatch => {
		dispatch(requestBegin(DELETE_FINANCE));
		return api
			.requestDELETE(`/actifPasifs/${financeID}`)
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(DELETE_FINANCE_SUCCESS, financeID, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(DELETE_FINANCE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(DELETE_FINANCE_FAIL, objError.response));
			});
	};
}

export function getAllData() {
	return dispatch => {
		dispatch(requestBegin(GET_ALL_DATA));
		return api
			.requestGET("/allData")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_ALL_DATA_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_ALL_DATA_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_ALL_DATA_FAIL, objError.response));
			});
	};
}
