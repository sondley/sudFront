import {
	GET_TAUXS,
	GET_TAUXS_SUCCESS,
	GET_TAUXS_FAIL,
	CREATE_TAUX,
	CREATE_TAUX_SUCCESS,
	CREATE_TAUX_FAIL,
	DELETE_TAUX,
	DELETE_TAUX_SUCCESS,
	DELETE_TAUX_FAIL,
	MODIFY_TAUX,
	MODIFY_TAUX_SUCCESS,
	MODIFY_TAUX_FAIL
} from "../actions/taux";
import { RESET_ERRORS } from "../actions/utils";

export default function taux(state = { monnaies: [], isFetching: false, message: [], error: false }, action) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_TAUXS:
			return { ...state, isFetching: true, error: false };
		case CREATE_TAUX:
			return { ...state, isFetching: true, error: false };
		case MODIFY_TAUX:
			return { ...state, isFetching: true, error: false };
		case DELETE_TAUX:
			return { ...state, isFetching: true, error: false };

		case GET_TAUXS_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, monnaies: payload.data, error: false, message };
		case CREATE_TAUX_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				monnaies: state.monnaies.concat(payload.data),
				error: false,
				message
			};
		case MODIFY_TAUX_SUCCESS:
			message = [].concat(payload.message);
			const array = state.monnaies.map(taux => {
				if (taux._id !== payload.data._id) {
					return taux;
				}
				return { ...taux, ...payload.data };
			});
			return { ...state, isFetching: false, monnaies: array, error: false, message };
		case DELETE_TAUX_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				monnaies: state.monnaies.filter(({ _id }) => _id !== payload.data),
				error: false,
				message
			};

		case GET_TAUXS_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case CREATE_TAUX_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_TAUX_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case DELETE_TAUX_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
