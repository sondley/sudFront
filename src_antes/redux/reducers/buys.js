import {
	GET_BUYS,
	GET_BUYS_SUCCESS,
	GET_BUYS_FAIL,
	CREATE_BUY,
	CREATE_BUY_SUCCESS,
	CREATE_BUY_FAIL,
	DELETE_BUY,
	DELETE_BUY_SUCCESS,
	DELETE_BUY_FAIL,
	MODIFY_BUY,
	MODIFY_BUY_SUCCESS,
	MODIFY_BUY_FAIL
} from "../actions/buys";
import { RESET_ERRORS } from "../actions/utils";
import { sortBy } from "lodash";

export default function buy(state = { buys: [], isFetching: false, message: [], error: false }, action) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_BUYS:
			return { ...state, isFetching: true, error: false };
		case CREATE_BUY:
			return { ...state, isFetching: true, error: false };
		case MODIFY_BUY:
			return { ...state, isFetching: true, error: false };
		case DELETE_BUY:
			return { ...state, isFetching: true, error: false };

		case GET_BUYS_SUCCESS:
			message = [].concat(payload.message);
			const buys = sortBy(payload.data, ["etat", "created"]).reverse();
			return { ...state, isFetching: false, buys, error: false, message };
		case CREATE_BUY_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, buys: [payload.data, ...state.buys], error: false, message };
		case MODIFY_BUY_SUCCESS:
			message = [].concat(payload.message);
			const array = state.buys.map(buy => {
				if (buy._id !== payload.data._id) {
					return buy;
				}
				return { ...buy, ...payload.data };
			});
			return { ...state, isFetching: false, buys: array, error: false, message };
		case DELETE_BUY_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				buys: state.buys.filter(({ _id }) => _id !== payload.data),
				error: false,
				message
			};

		case GET_BUYS_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case CREATE_BUY_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_BUY_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case DELETE_BUY_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
