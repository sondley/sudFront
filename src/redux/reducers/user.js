import {
	LOGOUT,
	LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGGED_USER,
	LOGGED_USER_SUCCESS,
	LOGGED_USER_FAIL,
	REFRESH_TOKEN,
	REFRESH_TOKEN_SUCCESS,
	REFRESH_TOKEN_FAIL,
	GET_USERS,
	GET_USERS_SUCCESS,
	GET_USERS_FAIL,
	CREATE_USER,
	CREATE_USER_SUCCESS,
	CREATE_USER_FAIL,
	MODIFY_USER,
	MODIFY_USER_SUCCESS,
	MODIFY_USER_FAIL
} from "../actions/user";
import { RESET_ERRORS } from "../actions/utils";

export default function user(
	state = { authedUser: undefined, users: [], token: null, isFetching: false, message: [], error: false },
	action
) {
	const { type, payload } = action;
	let message;
	switch (type) {
		//Login
		case LOGIN:
			return { ...state, isFetching: true, error: false };
		case LOGIN_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, authedUser: payload.user, token: payload.token, error: false, message };
		case LOGIN_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		//Logout
		case LOGOUT:
			return { ...state, isFetching: false, authedUser: null, token: null, error: false };

		//Check if already Logged In
		case LOGGED_USER:
			return { ...state, isFetching: true, error: false };
		case LOGGED_USER_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, authedUser: payload.user, token: payload.token, error: false, message };
		case LOGGED_USER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, authedUser: null, token: null, error: false, message };

		//Refresh Token (Keep Session Alive)
		case REFRESH_TOKEN:
			return { ...state, isFetching: true, error: false };
		case REFRESH_TOKEN_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, token: payload.token, error: false, message };
		case REFRESH_TOKEN_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		//Get Users
		case GET_USERS:
			return { ...state, isFetching: true, error: false };
		case GET_USERS_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, users: payload.user, error: false, message };
		case GET_USERS_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		//Create User
		case CREATE_USER:
			return { ...state, isFetching: true, error: false };
		case CREATE_USER_SUCCESS:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, users: [payload.user, ...state.users], error: false, message };
		case CREATE_USER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		//Modify User
		case MODIFY_USER:
			return { ...state, isFetching: true, error: false };
		case MODIFY_USER_SUCCESS:
			message = [].concat(payload.message);
			const array = state.users.map(user => {
				if (user._id !== payload.user._id) {
					return user;
				}
				return { ...user, ...payload.user };
			});
			return { ...state, isFetching: false, users: array, error: false, message };
		case MODIFY_USER_FAIL:
			message = [].concat(payload.message);
			return { ...state, isFetching: false, error: true, message };

		//Reset Errors
		case RESET_ERRORS:
			return { ...state, error: false, message: [] };

		default:
			return state;
	}
}
