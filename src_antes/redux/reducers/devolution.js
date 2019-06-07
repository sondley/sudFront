import {
	GET_DEVOLUTIONS,
	GET_DEVOLUTIONS_SUCCESS,
	GET_DEVOLUTIONS_FAIL,
	CREATE_DEVOLUTION,
	CREATE_DEVOLUTION_SUCCESS,
	CREATE_DEVOLUTION_FAIL,
	DELETE_DEVOLUTION,
	DELETE_DEVOLUTION_SUCCESS,
	DELETE_DEVOLUTION_FAIL,
	MODIFY_DEVOLUTION,
	MODIFY_DEVOLUTION_SUCCESS,
	MODIFY_DEVOLUTION_FAIL,
	VALIDATE_DEVOLUTION,
	VALIDATE_DEVOLUTION_SUCCESS,
	VALIDATE_DEVOLUTION_FAIL,
	GET_DEVOLUTION_ORDER,
	GET_DEVOLUTION_ORDER_SUCCESS,
	GET_DEVOLUTION_ORDER_FAIL
} from "../actions/devolution";
import { RESET_ERRORS } from "../actions/utils";
import { sortBy } from "lodash";

export default function devolution(
	state = { devolutions: [], printOrder: {}, isFetching: false, message: [], error: false },
	action
) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_DEVOLUTIONS:
			return { ...state, isFetching: true, error: false };
		case GET_DEVOLUTION_ORDER:
			return { ...state, isFetching: true, error: false };
		case CREATE_DEVOLUTION:
			return { ...state, isFetching: true, error: false };
		case MODIFY_DEVOLUTION:
			return { ...state, isFetching: true, error: false };
		case VALIDATE_DEVOLUTION:
			return { ...state, isFetching: true, error: false };
		case DELETE_DEVOLUTION:
			return { ...state, isFetching: true, error: false };

		case GET_DEVOLUTIONS_SUCCESS:
			message = [].concat(payload.message);
			const devolutions = sortBy(payload.data, ["etat", "created"]).reverse();
			return { ...state, isFetching: false, devolutions, error: false, message };
		case GET_DEVOLUTION_ORDER_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, printOrder: payload.data, error: false, message };
		case CREATE_DEVOLUTION_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				devolutions: [payload.data, ...state.devolutions],
				error: false,
				message
			};
		case MODIFY_DEVOLUTION_SUCCESS:
			message = [].concat(payload.message);
			const array = state.devolutions.map(devolution => {
				if (devolution._id !== payload.data._id) {
					return devolution;
				}
				return { ...devolution, ...payload.data };
			});
			return { ...state, isFetching: false, devolutions: array, error: false, message };
		case VALIDATE_DEVOLUTION_SUCCESS:
			message = [].concat(payload.message);
			const array2 = state.devolutions.map(devolution => {
				if (devolution._id !== payload.data._id) {
					return devolution;
				}
				return { ...devolution, ...payload.data };
			});
			return { ...state, isFetching: false, devolutions: array2, printOrder: payload.data, error: false, message };
		case DELETE_DEVOLUTION_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				devolutions: state.devolutions.filter(({ _id }) => _id !== payload.data),
				error: false,
				message
			};

		case GET_DEVOLUTIONS_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case GET_DEVOLUTION_ORDER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case CREATE_DEVOLUTION_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_DEVOLUTION_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case VALIDATE_DEVOLUTION_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case DELETE_DEVOLUTION_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
