import {
	GET_ORDERS,
	GET_ORDERS_SUCCESS,
	GET_ORDERS_FAIL,
	CREATE_ORDER,
	CREATE_ORDER_SUCCESS,
	CREATE_ORDER_FAIL,
	DELETE_ORDER,
	DELETE_ORDER_SUCCESS,
	DELETE_ORDER_FAIL,
	MODIFY_ORDER,
	MODIFY_ORDER_SUCCESS,
	MODIFY_ORDER_FAIL
} from "../actions/order";
import { RESET_ERRORS } from "../actions/utils";
import { sortBy } from "lodash";

export default function order(state = { orders: [], isFetching: false, message: [], error: false }, action) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_ORDERS:
			return { ...state, isFetching: true, error: false };
		case CREATE_ORDER:
			return { ...state, isFetching: true, error: false };
		case MODIFY_ORDER:
			return { ...state, isFetching: true, error: false };
		case DELETE_ORDER:
			return { ...state, isFetching: true, error: false };

		case GET_ORDERS_SUCCESS:
			message = [].concat(payload.message);
			const orders = sortBy(payload.data, ["etat", "created"]).reverse();
			return { ...state, isFetching: false, orders, error: false, message };
		case CREATE_ORDER_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				orders: [payload.data, ...state.orders],
				error: false,
				message
			};
		case MODIFY_ORDER_SUCCESS:
			message = [].concat(payload.message);
			const array = state.orders.map(order => {
				if (order._id !== payload.data._id) {
					return order;
				}
				return { ...order, ...payload.data };
			});
			return { ...state, isFetching: false, orders: array, error: false, message };
		case DELETE_ORDER_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				orders: state.orders.filter(({ _id }) => _id !== payload.data),
				error: false,
				message
			};

		case GET_ORDERS_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case CREATE_ORDER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_ORDER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case DELETE_ORDER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
