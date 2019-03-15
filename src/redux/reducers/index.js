import { combineReducers } from "redux";

//Reducers
import user from "./user";
import navigation from "./navigate";
import product from "./product";
import order from "./order";
import provider from "./provider";
import taux from "./taux";
import cointrade from "./cointrades";

export default combineReducers({
	user,
	navigation,
	product,
	order,
	provider,
	taux,
	cointrade
});
