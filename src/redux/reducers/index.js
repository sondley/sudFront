import { combineReducers } from "redux";

//Reducers
import user from "./user";
import navigation from "./navigate";
import product from "./product";
import order from "./order";

export default combineReducers({
	user,
	navigation,
	product,
	order
});
