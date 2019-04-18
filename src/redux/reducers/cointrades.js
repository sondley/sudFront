import {
	GET_COINTRADES,
	GET_COINTRADES_SUCCESS,
	GET_COINTRADES_FAIL,
	CREATE_COINTRADE,
	CREATE_COINTRADE_SUCCESS,
	CREATE_COINTRADE_FAIL,
	DELETE_COINTRADE,
	DELETE_COINTRADE_SUCCESS,
	DELETE_COINTRADE_FAIL,
	MODIFY_COINTRADE,
	MODIFY_COINTRADE_SUCCESS,
	MODIFY_COINTRADE_FAIL,
	VALIDATE_COINTRADE,
	VALIDATE_COINTRADE_SUCCESS,
	VALIDATE_COINTRADE_FAIL
} from "../actions/cointrades";
import { RESET_ERRORS } from "../actions/utils";
import { sortBy } from "lodash";

export default function cointrade(
	state = { transactions: [], printCoinTrade: {}, isFetching: false, message: [], error: false },
	action
) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_COINTRADES:
			return { ...state, isFetching: true, error: false };
		case CREATE_COINTRADE:
			return { ...state, isFetching: true, error: false };
		case MODIFY_COINTRADE:
			return { ...state, isFetching: true, error: false };
		case VALIDATE_COINTRADE:
			return { ...state, isFetching: true, error: false };
		case DELETE_COINTRADE:
			return { ...state, isFetching: true, error: false };

		case GET_COINTRADES_SUCCESS:
			message = [].concat(payload.message);
			const transactions = sortBy(payload.data, ["etat", "created"]).reverse();
			return { ...state, isFetching: false, transactions, error: false, message };
		case CREATE_COINTRADE_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				transactions: [payload.data, ...state.transactions],
				error: false,
				message
			};
		case MODIFY_COINTRADE_SUCCESS:
			message = [].concat(payload.message);
			const array = state.transactions.map(cointrade => {
				if (cointrade._id !== payload.data._id) {
					return cointrade;
				}
				return { ...cointrade, ...payload.data };
			});
			return { ...state, isFetching: false, transactions: array, error: false, message };
		case VALIDATE_COINTRADE_SUCCESS:
			message = [].concat(payload.message);
			const array2 = state.transactions.map(cointrade => {
				if (cointrade._id !== payload.data._id) {
					return cointrade;
				}
				return { ...cointrade, ...payload.data };
			});
			return { ...state, isFetching: false, transactions: array2, printCoinTrade: payload.data, error: false, message };
		case DELETE_COINTRADE_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				transactions: state.transactions.filter(({ _id }) => _id !== payload.data),
				error: false,
				message
			};

		case GET_COINTRADES_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case CREATE_COINTRADE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_COINTRADE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case VALIDATE_COINTRADE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case DELETE_COINTRADE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
