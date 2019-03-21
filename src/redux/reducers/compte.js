import {
	GET_TRANSACTIONS,
	GET_TRANSACTIONS_SUCCESS,
	GET_TRANSACTIONS_FAIL,
	GET_COMPTE,
	GET_COMPTE_SUCCESS,
	GET_COMPTE_FAIL,
	OPEN_CAISSE,
	OPEN_CAISSE_SUCCESS,
	OPEN_CAISSE_FAIL,
	CLOSE_CAISSE,
	CLOSE_CAISSE_SUCCESS,
	CLOSE_CAISSE_FAIL,
	GET_COMPTE_STATUS,
	GET_COMPTE_STATUS_SUCCESS,
	GET_COMPTE_STATUS_FAIL
} from "../actions/compte";
import { RESET_ERRORS } from "../actions/utils";
import { sortBy } from "lodash";

export default function compte(
	state = {
		transactions: [],
		moneyCompte: 0,
		moneyCoffre: 0,
		caisse: {},
		isFetching: false,
		message: [],
		error: false
	},
	action
) {
	const { payload, type } = action;
	let message;
	switch (type) {
		//Get Compte Transactions
		case GET_TRANSACTIONS:
			return { ...state, isFetching: true, error: false };

		case GET_TRANSACTIONS_SUCCESS:
			message = [].concat(payload.message);
			const transactions = sortBy(payload.data, ["created"]).reverse();
			return { ...state, isFetching: false, transactions, error: false, message };

		case GET_TRANSACTIONS_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		//Get Compte Money
		case GET_COMPTE:
			return { ...state, isFetching: true, error: false };

		case GET_COMPTE_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, moneyCompte: payload.data, error: false, message };

		case GET_COMPTE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		//Open Caisse
		case OPEN_CAISSE:
			return { ...state, isFetching: true, error: false };
		case OPEN_CAISSE_SUCCESS:
			message = [].concat(payload.message);
			return {
				...state,
				isFetching: false,
				caisse: payload.data,
				moneyCompte: payload.data.quantiteDonnee,
				error: false,
				message
			};
		case OPEN_CAISSE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		//Close Caisse
		case CLOSE_CAISSE:
			return { ...state, isFetching: true, error: false };
		case CLOSE_CAISSE_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, caisse: payload.data, error: false, message };
		case CLOSE_CAISSE_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		// Get Compte Status
		case GET_COMPTE_STATUS:
			return { ...state, isFetching: true, error: false };
		case GET_COMPTE_STATUS_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, caisse: payload.data[0], error: false, message };
		case GET_COMPTE_STATUS_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		default:
			return state;
	}
}
