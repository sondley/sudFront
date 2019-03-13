import React, { PureComponent } from "react";
import { Route, Redirect } from "react-router-dom";
import { omit } from "lodash";

class ProtectedRoute extends PureComponent {
	render() {
		const { isLoggedIn } = this.props;
		const oldProps = omit(this.props, "isLoggedIn");

		return isLoggedIn ? <Route {...oldProps} /> : <Redirect to="/" />;
	}
}

export default ProtectedRoute;
