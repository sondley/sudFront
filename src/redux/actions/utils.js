export const RESET_ERRORS = "RESET_ERRORS";
export const PAGINATION_CHANGE = "PAGINATION_CHANGE";

function requestBegin(type) {
	return { type };
}

export function resetError() {
	return dispatch => {
		return dispatch(requestBegin(RESET_ERRORS));
	};
}
