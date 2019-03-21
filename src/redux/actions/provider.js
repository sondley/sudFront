import api from "../../api";

export const GET_PROVIDERS = "GET_PROVIDERS";
export const GET_PROVIDERS_SUCCESS = "GET_PROVIDERS_SUCCESS";
export const GET_PROVIDERS_FAIL = "GET_PROVIDERS_FAIL";
export const CREATE_PROVIDER = "CREATE_PROVIDER";
export const CREATE_PROVIDER_SUCCESS = "CREATE_PROVIDER_SUCCESS";
export const CREATE_PROVIDER_FAIL = "CREATE_PROVIDER_FAIL";
export const DELETE_PROVIDER = "DELETE_PROVIDER";
export const DELETE_PROVIDER_SUCCESS = "DELETE_PROVIDER_SUCCESS";
export const DELETE_PROVIDER_FAIL = "DELETE_PROVIDER_FAIL";
export const MODIFY_PROVIDER = "MODIFY_PROVIDER";
export const MODIFY_PROVIDER_SUCCESS = "MODIFY_PROVIDER_SUCCESS";
export const MODIFY_PROVIDER_FAIL = "MODIFY_PROVIDER_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getProviders() {
	return dispatch => {
		dispatch(requestBegin(GET_PROVIDERS));
		return api
			.requestGET("/providers")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_PROVIDERS_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_PROVIDERS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_PROVIDERS_FAIL, objError.response));
			});
	};
}

export function createProvider(provider, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_PROVIDER));
		return api
			.requestPOST("/providers", {
				nom: provider.nom,
				addresse: provider.addresse,
				tel: provider.tel,
				email: provider.email
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_PROVIDER_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CREATE_PROVIDER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_PROVIDER, objError.response));
			});
	};
}

export function modifyProvider(provider, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_PROVIDER));
		return api
			.requestPUT(`/providers/${provider._id}`, {
				nom: provider.nom,
				addresse: provider.addresse,
				tel: provider.tel,
				email: provider.email
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_PROVIDER_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_PROVIDER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_PROVIDER_FAIL, objError.response));
			});
	};
}

export function deleteProvider(providerID, onClose) {
	return dispatch => {
		dispatch(requestBegin(DELETE_PROVIDER));
		return api
			.requestDELETE(`/providers/${providerID}`)
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(DELETE_PROVIDER_SUCCESS, providerID, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(DELETE_PROVIDER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(DELETE_PROVIDER_FAIL, objError.response));
			});
	};
}
