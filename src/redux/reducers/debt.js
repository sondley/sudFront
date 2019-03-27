import {
	GET_DEBTS_CLIENT,
	GET_DEBTS_CLIENT_SUCCESS,
	GET_DEBTS_CLIENT_FAIL,
	GET_DEBTS_PROVIDER,
	GET_DEBTS_PROVIDER_SUCCESS,
	GET_DEBTS_PROVIDER_FAIL,
	MODIFY_DEBT_CLIENT,
	MODIFY_DEBT_CLIENT_SUCCESS,
	MODIFY_DEBT_CLIENT_FAIL,
	MODIFY_DEBT_PROVIDER,
	MODIFY_DEBT_PROVIDER_SUCCESS,
	MODIFY_DEBT_PROVIDER_FAIL
} from "../actions/debt";
import { RESET_ERRORS } from "../actions/utils";
import { sortBy } from "lodash";

export default function debt(
	state = { debtClient: [], debtProvider: [], isFetching: false, message: [], error: false },
	action
) {
	const { payload, type } = action;
	let message;
	let sortedArray;
	let debtClient;
	let debtProvider;
	switch (type) {
		case GET_DEBTS_CLIENT:
			return { ...state, isFetching: true, error: false };
		case GET_DEBTS_PROVIDER:
			return { ...state, isFetching: true, error: false };
		case MODIFY_DEBT_CLIENT:
			return { ...state, isFetching: true, error: false };
		case MODIFY_DEBT_PROVIDER:
			return { ...state, isFetching: true, error: false };

		case GET_DEBTS_CLIENT_SUCCESS:
			message = [].concat(payload.message);
			sortedArray = sortBy(payload.data, ["created"]).reverse();
			debtClient = sortedArray.filter(({ quantite }) => {
				return quantite > 0;
			});
			return { ...state, isFetching: false, debtClient, error: false, message };
		case GET_DEBTS_PROVIDER_SUCCESS:
			message = [].concat(payload.message);
			sortedArray = sortBy(payload.data, ["created"]).reverse();
			debtProvider = sortedArray.filter(({ quantite }) => {
				return quantite > 0;
			});
			return { ...state, isFetching: false, debtProvider, error: false, message };
		case MODIFY_DEBT_CLIENT_SUCCESS:
			message = [].concat(payload.message);
			const array = state.debtClient.map(debt => {
				if (debt._id !== payload.data._id) {
					return debt;
				}
				return { ...debt, ...payload.data };
			});
			debtClient = array.filter(({ quantite }) => {
				return quantite > 0;
			});
			return { ...state, isFetching: false, debtClient, error: false, message };
		case MODIFY_DEBT_PROVIDER_SUCCESS:
			message = [].concat(payload.message);
			const array2 = state.debtProvider.map(debt => {
				if (debt._id !== payload.data._id) {
					return debt;
				}
				return { ...debt, ...payload.data };
			});
			debtProvider = array2.filter(({ quantite }) => {
				return quantite > 0;
			});
			return { ...state, isFetching: false, debtProvider, error: false, message };

		case GET_DEBTS_CLIENT_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case GET_DEBTS_PROVIDER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_DEBT_CLIENT_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case MODIFY_DEBT_PROVIDER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
