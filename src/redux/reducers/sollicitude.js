import {
	GET_SOLLICITUDES,
	GET_SOLLICITUDES_SUCCESS,
	GET_SOLLICITUDES_FAIL,
	CREATE_SOLLICITUDE,
	CREATE_SOLLICITUDE_SUCCESS,
	CREATE_SOLLICITUDE_FAIL,
	DELETE_SOLLICITUDE,
	DELETE_SOLLICITUDE_SUCCESS,
	DELETE_SOLLICITUDE_FAIL,
	MODIFY_SOLLICITUDE,
	MODIFY_SOLLICITUDE_SUCCESS,
	MODIFY_SOLLICITUDE_FAIL
} from "../actions/sollicitude";
import { RESET_ERRORS } from "../actions/utils";
import { sortBy } from "lodash";

export default function sollicitude(
	state = { sollicitudes: [], isFetching: false, message: [], error: false },
	action
) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_SOLLICITUDES:
			return { ...state, isFetching: true, error: false };
		case CREATE_SOLLICITUDE:
			return { ...state, isFetching: true, error: false };
		case MODIFY_SOLLICITUDE:
			return { ...state, isFetching: true, error: false };
		case DELETE_SOLLICITUDE:
			return { ...state, isFetching: true, error: false };

		case GET_SOLLICITUDES_SUCCESS:
			message = [].concat(payload.message);
			const sollicitudes = sortBy(payload.data, ["etat", "created"]).reverse();
			return { ...state, isFetching: false, sollicitudes, error: false, message };
		case CREATE_SOLLICITUDE_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				sollicitudes: [payload.data, ...state.sollicitudes],
				error: false,
				message
			};
		case MODIFY_SOLLICITUDE_SUCCESS:
			message = [].concat(payload.message);
			const array = state.sollicitudes.map(sollicitude => {
				if (sollicitude._id !== payload.data._id) {
					return sollicitude;
				}
				return { ...sollicitude, ...payload.data };
			});
			return { ...state, isFetching: false, sollicitudes: array, error: false, message };
		case DELETE_SOLLICITUDE_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				sollicitudes: state.sollicitudes.filter(({ _id }) => _id !== payload.data),
				error: false,
				message
			};

		case GET_SOLLICITUDES_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case CREATE_SOLLICITUDE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_SOLLICITUDE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case DELETE_SOLLICITUDE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
