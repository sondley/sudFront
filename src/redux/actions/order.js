import api from "../../api";

export const GET_ORDERS = "GET_ORDERS";
export const GET_ORDERS_SUCCESS = "GET_ORDERS_SUCCESS";
export const GET_ORDERS_FAIL = "GET_ORDERS_FAIL";
export const CREATE_ORDER = "CREATE_ORDER";
export const CREATE_ORDER_SUCCESS = "CREATE_ORDER_SUCCESS";
export const CREATE_ORDER_FAIL = "CREATE_ORDER_FAIL";
export const DELETE_ORDER = "DELETE_ORDER";
export const DELETE_ORDER_SUCCESS = "DELETE_ORDER_SUCCESS";
export const DELETE_ORDER_FAIL = "DELETE_ORDER_FAIL";
export const MODIFY_ORDER = "MODIFY_ORDER";
export const MODIFY_ORDER_SUCCESS = "MODIFY_ORDER_SUCCESS";
export const MODIFY_ORDER_FAIL = "MODIFY_ORDER_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, data, message) {
	return { type, payload: { data, message } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

export function getOrders() {
	return dispatch => {
		dispatch(requestBegin(GET_ORDERS));
		return api
			.requestGET("/ordens")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_ORDERS_SUCCESS, objResponse.data.data, objResponse.data.message));
				} else {
					dispatch(requestFail(GET_ORDERS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_ORDERS_FAIL, objError.response.data.message));
			});
	};
}

export function createOrder(order, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_ORDER));
		return api
			.requestPOST("/ordens", {
				client: order.client,
				vendeur: order.vendeur,
				arrayOrden: order.arrayOrden
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_ORDER_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(CREATE_ORDER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_ORDER, objError.response.data.message));
			});
	};
}

export function modifyOrder(order, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_ORDER));
		return api
			.requestPUT(`/ordens/${order._id}`, {
				client: order.client,
				vendeur: order.vendeur,
				arrayOrden: order.arrayOrden
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_ORDER_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_ORDER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_ORDER_FAIL, objError.response));
			});
	};
}

export function deleteOrder(orderID, onClose) {
	return dispatch => {
		dispatch(requestBegin(DELETE_ORDER));
		return api
			.requestDELETE(`/ordens/${orderID}`)
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(DELETE_ORDER_SUCCESS, orderID, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(DELETE_ORDER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(DELETE_ORDER_FAIL, objError.response.data.message));
			});
	};
}

export function validateOrder(userID, orderID, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_ORDER));
		return api
			.requestPOST("/validateOrden", {
				idUser: userID,
				idCommande: orderID
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_ORDER_SUCCESS, objResponse.data.data, objResponse.data.message));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_ORDER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_ORDER_FAIL, objError.response.data.message));
			});
	};
}
