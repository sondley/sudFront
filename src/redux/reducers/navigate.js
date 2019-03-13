import { NAVIGATE, PAGE_INDEX, RESET_NAVIGATE } from "../actions/navigate";
import { LOGIN_SUCCESS, LOGGED_USER_SUCCESS, LOGOUT } from "../actions/user";
import { findIndex } from "lodash";

export default function navigation(state = { index: 0, route: "", navigate: false, navTree: [] }, action) {
	const { type, payload } = action;
	switch (type) {
		case NAVIGATE:
			return { ...state, index: payload.index, route: payload.route, navigate: payload.navigate };

		case RESET_NAVIGATE:
			return { ...state, navigate: false };

		case PAGE_INDEX:
			const newIndex = findIndex(state.navTree, { name: payload.route });
			return { ...state, index: newIndex };

		case LOGIN_SUCCESS:
			return { ...state, navTree: payload.navTree };

		case LOGGED_USER_SUCCESS:
			return { ...state, navTree: payload.navTree };

		case LOGOUT:
			return { ...state, navTree: [] };

		default:
			return state;
	}
}
