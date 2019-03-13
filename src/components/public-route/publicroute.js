import React, { PureComponent } from "react";
import { Route, Redirect } from "react-router-dom";
import { omit } from "lodash";

class PublicRoute extends PureComponent {
	getPageForRole = (isLoggedIn, user) => {
		let page = "";
		if (isLoggedIn && user !== null) {
			switch (user.role) {
				case "caissier":
					page = "/validate_solicitude";
					break;
				case "directeur":
					page = "/director_reports";
					break;
				case "vendeur":
					page = "/orders";
					break;
				case "contable":
					page = "/cash_status";
					break;
				case "assistance":
					page = "/warehouse";
					break;
				case "comite":
					page = "/benefits_reports";
					break;
				default:
					break;
			}
		}
		return page;
	};

	render() {
		const { isLoggedIn, user } = this.props;
		const oldProps = omit(this.props, ["isLoggedIn", "user"]);

		let page = this.getPageForRole(isLoggedIn, user);

		return isLoggedIn ? <Redirect to={page} /> : <Route {...oldProps} />;
	}
}

export default PublicRoute;
