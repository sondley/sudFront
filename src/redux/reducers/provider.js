import {
	GET_PROVIDERS,
	GET_PROVIDERS_SUCCESS,
	GET_PROVIDERS_FAIL,
	CREATE_PROVIDER,
	CREATE_PROVIDER_SUCCESS,
	CREATE_PROVIDER_FAIL,
	DELETE_PROVIDER,
	DELETE_PROVIDER_SUCCESS,
	DELETE_PROVIDER_FAIL,
	MODIFY_PROVIDER,
	MODIFY_PROVIDER_SUCCESS,
	MODIFY_PROVIDER_FAIL
} from "../actions/provider";
import { RESET_ERRORS } from "../actions/utils";

export default function provider(state = { providers: [], isFetching: false, message: [], error: false }, action) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_PROVIDERS:
			return { ...state, isFetching: true, error: false };
		case CREATE_PROVIDER:
			return { ...state, isFetching: true, error: false };
		case MODIFY_PROVIDER:
			return { ...state, isFetching: true, error: false };
		case DELETE_PROVIDER:
			return { ...state, isFetching: true, error: false };

		case GET_PROVIDERS_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, providers: payload.data, error: false, message };
		case CREATE_PROVIDER_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				providers: state.providers.concat(payload.data),
				error: false,
				message
			};
		case MODIFY_PROVIDER_SUCCESS:
			message = [].concat(payload.message);
			const array = state.providers.map(provider => {
				if (provider._id !== payload.data._id) {
					return provider;
				}
				return { ...provider, ...payload.data };
			});
			return { ...state, isFetching: false, providers: array, error: false, message };
		case DELETE_PROVIDER_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				providers: state.providers.filter(({ _id }) => _id !== payload.data),
				error: false,
				message
			};

		case GET_PROVIDERS_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case CREATE_PROVIDER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_PROVIDER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case DELETE_PROVIDER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
