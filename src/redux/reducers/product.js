import {
	GET_PRODUCTS,
	GET_PRODUCTS_SUCCESS,
	GET_PRODUCTS_FAIL,
	CREATE_PRODUCT,
	CREATE_PRODUCT_SUCCESS,
	CREATE_PRODUCT_FAIL,
	DELETE_PRODUCT,
	DELETE_PRODUCT_SUCCESS,
	DELETE_PRODUCT_FAIL,
	MODIFY_PRODUCT,
	MODIFY_PRODUCT_SUCCESS,
	MODIFY_PRODUCT_FAIL
} from "../actions/product";
import { RESET_ERRORS } from "../actions/utils";

export default function product(state = { products: [], isFetching: false, message: [], error: false }, action) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_PRODUCTS:
			return { ...state, isFetching: true, error: false };
		case CREATE_PRODUCT:
			return { ...state, isFetching: true, error: false };
		case MODIFY_PRODUCT:
			return { ...state, isFetching: true, error: false };
		case DELETE_PRODUCT:
			return { ...state, isFetching: true, error: false };

		case GET_PRODUCTS_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, products: payload.data, error: false, message };
		case CREATE_PRODUCT_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				products: state.products.concat(payload.data),
				error: false,
				message
			};
		case MODIFY_PRODUCT_SUCCESS:
			message = [].concat(payload.message);
			const array = state.products.map(product => {
				if (product._id !== payload.data._id) {
					return product;
				}
				return { ...product, ...payload.data };
			});
			return { ...state, isFetching: false, products: array, error: false, message };
		case DELETE_PRODUCT_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				products: state.products.filter(({ _id }) => _id !== payload.data),
				error: false,
				message
			};

		case GET_PRODUCTS_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case CREATE_PRODUCT_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_PRODUCT_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case DELETE_PRODUCT_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
