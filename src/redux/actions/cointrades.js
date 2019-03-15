import api from "../../api";

export const GET_COINTRADES = "GET_COINTRADES";
export const GET_COINTRADES_SUCCESS = "GET_COINTRADES_SUCCESS";
export const GET_COINTRADES_FAIL = "GET_COINTRADES_FAIL";
export const CREATE_COINTRADE = "CREATE_COINTRADE";
export const CREATE_COINTRADE_SUCCESS = "CREATE_COINTRADE_SUCCESS";
export const CREATE_COINTRADE_FAIL = "CREATE_COINTRADE_FAIL";
export const DELETE_COINTRADE = "DELETE_COINTRADE";
export const DELETE_COINTRADE_SUCCESS = "DELETE_COINTRADE_SUCCESS";
export const DELETE_COINTRADE_FAIL = "DELETE_COINTRADE_FAIL";
export const MODIFY_COINTRADE = "MODIFY_COINTRADE";
export const MODIFY_COINTRADE_SUCCESS = "MODIFY_COINTRADE_SUCCESS";
export const MODIFY_COINTRADE_FAIL = "MODIFY_COINTRADE_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getCoinTrades() {
	return dispatch => {
		dispatch(requestBegin(GET_COINTRADES));
		return api
			.requestGET("/transactionEchanges")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_COINTRADES_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_COINTRADES_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_COINTRADES_FAIL, objError.response.data.message));
			});
	};
}

export function createCoinTrade(cointrade, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_COINTRADE));
		return api
			.requestPOST("/transactionEchanges", {
				type: cointrade.type,
				monnaie: cointrade.monnaie,
				quantite: cointrade.quantite,
				idVendeur: cointrade.idVendeur,
				client: cointrade.client
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_COINTRADE_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CREATE_COINTRADE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_COINTRADE, objError.response.data.message));
			});
	};
}

export function modifyCoinTrade(cointrade, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_COINTRADE));
		return api
			.requestPUT(`/transactionEchanges/${cointrade._id}`, {
				type: cointrade.type,
				monnaie: cointrade.monnaie,
				quantite: cointrade.quantite,
				idVendeur: cointrade.idVendeur,
				client: cointrade.client
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_COINTRADE_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_COINTRADE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_COINTRADE_FAIL, objError.response));
			});
	};
}

export function deleteCoinTrade(cointradeID, onClose) {
	return dispatch => {
		dispatch(requestBegin(DELETE_COINTRADE));
		return api
			.requestDELETE(`/transactionEchanges/${cointradeID}`)
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(DELETE_COINTRADE_SUCCESS, cointradeID, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(DELETE_COINTRADE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(DELETE_COINTRADE_FAIL, objError.response.data.message));
			});
	};
}

export function validateCoinTrade(cointrade, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_COINTRADE));
		return api
			.requestPOST("/validateOrden", {
				idUser: cointrade.idUser,
				idCommande: cointrade.idCommande,
				typePaiement: cointrade.typePaiement,
				totalDonne: cointrade.totalDonne
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_COINTRADE_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_COINTRADE_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_COINTRADE_FAIL, objError.response.data.message));
			});
	};
}
