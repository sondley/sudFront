import { GET_NOTIFICATIONS, GET_NOTIFICATIONS_SUCCESS, GET_NOTIFICATIONS_FAIL } from "../actions/notifications";
import { RESET_ERRORS } from "../actions/utils";
import { sortBy } from "lodash";

export default function notification(
	state = { notifications: [], isFetching: false, message: [], error: false },
	action
) {
	const { payload, type } = action;
	let message;
	switch (type) {
		case GET_NOTIFICATIONS:
			return { ...state, isFetching: true, error: false };

		case GET_NOTIFICATIONS_SUCCESS:
			message = [].concat(payload.message);
			const notifications = sortBy(payload.data, ["created"]).reverse();
			return { ...state, isFetching: false, notifications, error: false, message };

		case GET_NOTIFICATIONS_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
