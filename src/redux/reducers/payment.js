import {
	GET_PAYMENTS,
	GET_PAYMENTS_SUCCESS,
	GET_PAYMENTS_FAIL,
	CREATE_PAYMENT,
	CREATE_PAYMENT_SUCCESS,
	CREATE_PAYMENT_FAIL
} from "../actions/payment";
import { RESET_ERRORS } from "../actions/utils";
import { sortBy } from "lodash";

export default function payment(state = { payments: [], isFetching: false, message: [], error: false }, action) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_PAYMENTS:
			return { ...state, isFetching: true, error: false };
		case CREATE_PAYMENT:
			return { ...state, isFetching: true, error: false };

		case GET_PAYMENTS_SUCCESS:
			message = [].concat(payload.message);
			const payments = sortBy(payload.data, ["etat"]).reverse();
			return { ...state, isFetching: false, payments, error: false, message };
		case CREATE_PAYMENT_SUCCESS:
			message = [].concat(payload.message);
			const array = state.payments.map(payment => {
				if (payment._id !== payload.data._id) {
					return payment;
				}
				return { ...payment, ...payload.data };
			});
			return { ...state, isFetching: false, payments: array, error: false, message };

		case GET_PAYMENTS_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };
		case CREATE_PAYMENT_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
