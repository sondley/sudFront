import api from "../../api";

export const GET_TRANSACTIONS = "GET_TRANSACTIONS";
export const GET_TRANSACTIONS_SUCCESS = "GET_TRANSACTIONS_SUCCESS";
export const GET_TRANSACTIONS_FAIL = "GET_TRANSACTIONS_FAIL";
export const GET_COMPTE = "GET_COMPTE";
export const GET_COMPTE_SUCCESS = "GET_COMPTE_SUCCESS";
export const GET_COMPTE_FAIL = "GET_COMPTE_FAIL";
export const GET_COMPTE_STATUS = "GET_COMPTE_STATUS";
export const GET_COMPTE_STATUS_SUCCESS = "GET_COMPTE_STATUS_SUCCESS";
export const GET_COMPTE_STATUS_FAIL = "GET_COMPTE_STATUS_FAIL";
export const OPEN_CAISSE = "OPEN_CAISSE";
export const OPEN_CAISSE_SUCCESS = "OPEN_CAISSE_SUCCESS";
export const OPEN_CAISSE_FAIL = "OPEN_CAISSE_FAIL";
export const CLOSE_CAISSE = "CLOSE_CAISSE";
export const CLOSE_CAISSE_SUCCESS = "CLOSE_CAISSE_SUCCESS";
export const CLOSE_CAISSE_FAIL = "CLOSE_CAISSE_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getTransactions() {
	return dispatch => {
		dispatch(requestBegin(GET_TRANSACTIONS));
		return api
			.requestGET("/transactionCaisseToday")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_TRANSACTIONS_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_TRANSACTIONS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_TRANSACTIONS_FAIL, objError.response));
			});
	};
}

export function getCompte() {
	return dispatch => {
		dispatch(requestBegin(GET_COMPTE));
		return api
			.requestGET("/totalDisponibleCaisseToday")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_COMPTE_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_COMPTE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_COMPTE_FAIL, objError.response));
			});
	};
}

export function OpenCaisse(item, onClose) {
	return dispatch => {
		dispatch(requestBegin(OPEN_CAISSE));
		return api
			.requestPOST("/openCaisse", {
				idVendeur: item.idVendeur,
				quantiteDonnee: item.quantiteDonnee
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(OPEN_CAISSE_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(OPEN_CAISSE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(OPEN_CAISSE_FAIL, objError.response));
			});
	};
}

export function CloseCaisse(item, onClose) {
	return dispatch => {
		dispatch(requestBegin(CLOSE_CAISSE));
		return api
			.requestPOST("/closeCaisse", {
				idUser: item.idUser,
				quantiteRemise: item.quantiteRemise
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CLOSE_CAISSE_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CLOSE_CAISSE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CLOSE_CAISSE_FAIL, objError.response));
			});
	};
}

export function getCaisseStatus() {
	return dispatch => {
		dispatch(requestBegin(GET_COMPTE_STATUS));
		return api
			.requestGET("/getCaisseNow")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_COMPTE_STATUS_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_COMPTE_STATUS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_COMPTE_STATUS_FAIL, objError.response));
			});
	};
}
