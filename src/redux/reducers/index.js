import { combineReducers } from "redux";

//Reducers
import user from "./user";
import navigation from "./navigate";
import product from "./product";
import order from "./order";
import provider from "./provider";
import taux from "./taux";
import cointrade from "./cointrades";
import buy from "./buys";
import compte from "./compte";
import sollicitude from "./sollicitude";
import payment from "./payment";
import debt from "./debt";
import tax from "./tax";

export default combineReducers({
	user,
	navigation,
	product,
	order,
	provider,
	taux,
	cointrade,
	buy,
	compte,
	sollicitude,
	payment,
	debt,
	tax
});
