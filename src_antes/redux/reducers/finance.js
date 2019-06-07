import {
	GET_FINANCES,
	GET_FINANCES_SUCCESS,
	GET_FINANCES_FAIL,
	CREATE_FINANCE,
	CREATE_FINANCE_SUCCESS,
	CREATE_FINANCE_FAIL,
	DELETE_FINANCE,
	DELETE_FINANCE_SUCCESS,
	DELETE_FINANCE_FAIL,
	MODIFY_FINANCE,
	MODIFY_FINANCE_SUCCESS,
	MODIFY_FINANCE_FAIL,
	GET_ALL_DATA,
	GET_ALL_DATA_SUCCESS,
	GET_ALL_DATA_FAIL
} from "../actions/finance";
import { RESET_ERRORS } from "../actions/utils";

export default function finance(
	state = { finances: [], allData: [], isFetching: false, message: [], error: false },
	action
) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_FINANCES:
			return { ...state, isFetching: true, error: false };
		case GET_ALL_DATA:
			return { ...state, isFetching: true, error: false };
		case CREATE_FINANCE:
			return { ...state, isFetching: true, error: false };
		case MODIFY_FINANCE:
			return { ...state, isFetching: true, error: false };
		case DELETE_FINANCE:
			return { ...state, isFetching: true, error: false };

		case GET_FINANCES_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, finances: payload.data, error: false, message };
		case GET_ALL_DATA_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, allData: payload.data, error: false, message };
		case CREATE_FINANCE_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				finances: [payload.data, ...state.finances],
				error: false,
				message
			};
		case MODIFY_FINANCE_SUCCESS:
			message = [].concat(payload.message);
			const array = state.finances.map(finance => {
				if (finance._id !== payload.data._id) {
					return finance;
				}
				return { ...finance, ...payload.data };
			});
			return { ...state, isFetching: false, finances: array, error: false, message };
		case DELETE_FINANCE_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				finances: state.finances.filter(({ _id }) => _id !== payload.data),
				error: false,
				message
			};

		case GET_FINANCES_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case GET_ALL_DATA_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case CREATE_FINANCE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_FINANCE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case DELETE_FINANCE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
