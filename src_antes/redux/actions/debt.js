import api from "../../api";

export const GET_DEBTS_CLIENT = "GET_DEBTS_CLIENT";
export const GET_DEBTS_CLIENT_SUCCESS = "GET_DEBTS_CLIENT_SUCCESS";
export const GET_DEBTS_CLIENT_FAIL = "GET_DEBTS_CLIENT_FAIL";
export const MODIFY_DEBT_CLIENT = "MODIFY_DEBT_CLIENT";
export const MODIFY_DEBT_CLIENT_SUCCESS = "MODIFY_DEBT_CLIENT_SUCCESS";
export const MODIFY_DEBT_CLIENT_FAIL = "MODIFY_DEBT_CLIENT_FAIL";
export const GET_DEBTS_PROVIDER = "GET_DEBTS_PROVIDER";
export const GET_DEBTS_PROVIDER_SUCCESS = "GET_DEBTS_PROVIDER_SUCCESS";
export const GET_DEBTS_PROVIDER_FAIL = "GET_DEBTS_PROVIDER_FAIL";
export const MODIFY_DEBT_PROVIDER = "MODIFY_DEBT_PROVIDER";
export const MODIFY_DEBT_PROVIDER_SUCCESS = "MODIFY_DEBT_PROVIDER_SUCCESS";
export const MODIFY_DEBT_PROVIDER_FAIL = "MODIFY_DEBT_PROVIDER_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getDebtsClient() {
	return dispatch => {
		dispatch(requestBegin(GET_DEBTS_CLIENT));
		return api
			.requestGET("/detteClientes")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_DEBTS_CLIENT_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_DEBTS_CLIENT_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_DEBTS_CLIENT_FAIL, objError.response));
			});
	};
}

export function getDebtsClientByRange(startDate, endDate) {
	return dispatch => {
		dispatch(requestBegin(GET_DEBTS_CLIENT));
		return api
			.requestPOST("/rangeDetteClientes", {
				start: startDate,
				end: endDate
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_DEBTS_CLIENT_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_DEBTS_CLIENT_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_DEBTS_CLIENT_FAIL, objError.response));
			});
	};
}

export function getDebtsProvider() {
	return dispatch => {
		dispatch(requestBegin(GET_DEBTS_PROVIDER));
		return api
			.requestGET("/detteFournisseurs")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_DEBTS_PROVIDER_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_DEBTS_PROVIDER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_DEBTS_PROVIDER_FAIL, objError.response));
			});
	};
}

export function getDebtsProviderByRange(startDate, endDate) {
	return dispatch => {
		dispatch(requestBegin(GET_DEBTS_PROVIDER));
		return api
			.requestPOST("/rangeDetteFournisseurs", {
				start: startDate,
				end: endDate
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_DEBTS_PROVIDER_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_DEBTS_PROVIDER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_DEBTS_PROVIDER_FAIL, objError.response));
			});
	};
}

export function modifyDebtClient(item, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_DEBT_CLIENT));
		return api
			.requestPUT(`/detteCliente/${item.idDette}`, {
				quantite: item.quantite
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_DEBT_CLIENT_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_DEBT_CLIENT_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_DEBT_CLIENT_FAIL, objError.response));
			});
	};
}

export function modifyDebtProvider(item, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_DEBT_PROVIDER));
		return api
			.requestPUT(`/detteFournisseur/${item.idDette}`, {
				quantite: item.quantite
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_DEBT_PROVIDER_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_DEBT_PROVIDER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_DEBT_PROVIDER_FAIL, objError.response));
			});
	};
}
