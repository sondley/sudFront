import api from "../../api";

export const GET_PRODUCTS = "GET_PRODUCTS";
export const GET_PRODUCTS_SUCCESS = "GET_PRODUCTS_SUCCESS";
export const GET_PRODUCTS_FAIL = "GET_PRODUCTS_FAIL";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const CREATE_PRODUCT_SUCCESS = "CREATE_PRODUCT_SUCCESS";
export const CREATE_PRODUCT_FAIL = "CREATE_PRODUCT_FAIL";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const DELETE_PRODUCT_SUCCESS = "DELETE_PRODUCT_SUCCESS";
export const DELETE_PRODUCT_FAIL = "DELETE_PRODUCT_FAIL";
export const MODIFY_PRODUCT = "MODIFY_PRODUCT";
export const MODIFY_PRODUCT_SUCCESS = "MODIFY_PRODUCT_SUCCESS";
export const MODIFY_PRODUCT_FAIL = "MODIFY_PRODUCT_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getProducts() {
	return dispatch => {
		dispatch(requestBegin(GET_PRODUCTS));
		return api
			.requestGET("/Iproduits")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_PRODUCTS_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_PRODUCTS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_PRODUCTS_FAIL, objError.response));
			});
	};
}

export function createProduct(product, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_PRODUCT));
		return api
			.requestPOST("/Iproduits", {
				nom: product.name,
				provider: product.fournisseur,
				unit: product.qty,
				sellPrice: product.sellPrice,
				buyPrice: product.buyPrice,
				size: product.size,
				Description: product.description,
				limit: parseInt(product.limit)
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_PRODUCT_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CREATE_PRODUCT_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_PRODUCT, objError.response));
			});
	};
}

export function modifyProduct(product, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_PRODUCT));
		return api
			.requestPUT(`/Iproduits/${product._id}`, {
				nom: product.name,
				provider: product.fournisseur,
				unit: product.qty,
				sellPrice: product.sellPrice,
				buyPrice: product.buyPrice,
				size: product.size,
				Description: product.description,
				limit: parseInt(product.limit)
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_PRODUCT_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_PRODUCT_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_PRODUCT_FAIL, objError.response));
			});
	};
}

export function deleteProduct(productID, onClose) {
	return dispatch => {
		dispatch(requestBegin(DELETE_PRODUCT));
		return api
			.requestDELETE(`/Iproduits/${productID}`)
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(DELETE_PRODUCT_SUCCESS, productID, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(DELETE_PRODUCT_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(DELETE_PRODUCT_FAIL, objError.response));
			});
	};
}
