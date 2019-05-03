import React, { PureComponent } from "react";

//Components
import LoginForm from "../../components/login-form/loginform";

class LoginScreen extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			toRegister: false
		};
	}

	render() {
		return (
			<div id="login">
				<div className="loginContainer">
					<LoginForm active navigate={this.handleNavigate} />
				</div>
			</div>
		);
	}
}

export default LoginScreen;
