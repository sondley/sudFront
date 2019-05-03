import {
	GET_TAXES,
	GET_TAXES_SUCCESS,
	GET_TAXES_FAIL,
	CREATE_TAX,
	CREATE_TAX_SUCCESS,
	CREATE_TAX_FAIL,
	DELETE_TAX,
	DELETE_TAX_SUCCESS,
	DELETE_TAX_FAIL,
	MODIFY_TAX,
	MODIFY_TAX_SUCCESS,
	MODIFY_TAX_FAIL
} from "../actions/tax";
import { RESET_ERRORS } from "../actions/utils";
import { sortBy } from "lodash";

export default function tax(state = { taxes: [], isFetching: false, message: [], error: false }, action) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_TAXES:
			return { ...state, isFetching: true, error: false };
		case CREATE_TAX:
			return { ...state, isFetching: true, error: false };
		case MODIFY_TAX:
			return { ...state, isFetching: true, error: false };
		case DELETE_TAX:
			return { ...state, isFetching: true, error: false };

		case GET_TAXES_SUCCESS:
			message = [].concat(payload.message);
			const taxes = sortBy(payload.data, ["etat", "created"]).reverse();
			return { ...state, isFetching: false, taxes, error: false, message };
		case CREATE_TAX_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				taxes: [payload.data, ...state.taxes],
				error: false,
				message
			};
		case MODIFY_TAX_SUCCESS:
			message = [].concat(payload.message);
			const array = state.taxes.map(tax => {
				if (tax._id !== payload.data._id) {
					return tax;
				}
				return { ...tax, ...payload.data };
			});
			return { ...state, isFetching: false, taxes: array, error: false, message };
		case DELETE_TAX_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				taxes: state.taxes.filter(({ _id }) => _id !== payload.data),
				error: false,
				message
			};

		case GET_TAXES_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case CREATE_TAX_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_TAX_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case DELETE_TAX_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
