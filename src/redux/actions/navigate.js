export const NAVIGATE = "NAVIGATE";
export const RESET_NAVIGATE = "RESET_NAVIGATE";
export const PAGE_INDEX = "PAGE_INDEX";

function navigation(type, route) {
	return { type, payload: { route, navigate: true } };
}

function resetNavigation() {
	return { type: RESET_NAVIGATE };
}

function setPageIndexByRoute(route) {
	return { type: PAGE_INDEX, payload: { route } };
}

export function endNavigation() {
	return dispatch => {
		return dispatch(resetNavigation());
	};
}

export function menuNavigation(route) {
	return dispatch => {
		const currentWindow = window.location.pathname;
		if (currentWindow !== route) {
			dispatch(navigation(NAVIGATE, route));
		}
	};
}

export function getPageIndexByRoute(route) {
	return dispatch => {
		dispatch(setPageIndexByRoute(route));
	};
}
