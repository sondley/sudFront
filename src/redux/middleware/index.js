import { applyMiddleware } from "redux";
import { createLogger } from "redux-logger";

//Middlewares
import thunk from "redux-thunk";
const logger = createLogger({ collapsed: true });

export default applyMiddleware(thunk, logger);
