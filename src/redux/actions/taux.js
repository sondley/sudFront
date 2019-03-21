import api from "../../api";

export const GET_TAUXS = "GET_TAUXS";
export const GET_TAUXS_SUCCESS = "GET_TAUXS_SUCCESS";
export const GET_TAUXS_FAIL = "GET_TAUXS_FAIL";
export const CREATE_TAUX = "CREATE_TAUX";
export const CREATE_TAUX_SUCCESS = "CREATE_TAUX_SUCCESS";
export const CREATE_TAUX_FAIL = "CREATE_TAUX_FAIL";
export const DELETE_TAUX = "DELETE_TAUX";
export const DELETE_TAUX_SUCCESS = "DELETE_TAUX_SUCCESS";
export const DELETE_TAUX_FAIL = "DELETE_TAUX_FAIL";
export const MODIFY_TAUX = "MODIFY_TAUX";
export const MODIFY_TAUX_SUCCESS = "MODIFY_TAUX_SUCCESS";
export const MODIFY_TAUX_FAIL = "MODIFY_TAUX_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getTauxs() {
	return dispatch => {
		dispatch(requestBegin(GET_TAUXS));
		return api
			.requestGET("/echanges")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_TAUXS_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_TAUXS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_TAUXS_FAIL, objError.response));
			});
	};
}

export function createTaux(taux, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_TAUX));
		return api
			.requestPOST("/echanges", {
				nom: taux.nom,
				prixVente: taux.prixVente,
				prixAchat: taux.prixAchat
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_TAUX_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CREATE_TAUX_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_TAUX, objError.response));
			});
	};
}

export function modifyTaux(taux, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_TAUX));
		return api
			.requestPUT(`/echanges/${taux._id}`, {
				nom: taux.nom,
				prixVente: taux.prixVente,
				prixAchat: taux.prixAchat
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_TAUX_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_TAUX_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_TAUX_FAIL, objError.response));
			});
	};
}

export function deleteTaux(tauxID, onClose) {
	return dispatch => {
		dispatch(requestBegin(DELETE_TAUX));
		return api
			.requestDELETE(`/echanges/${tauxID}`)
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(DELETE_TAUX_SUCCESS, tauxID, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(DELETE_TAUX_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(DELETE_TAUX_FAIL, objError.response));
			});
	};
}
