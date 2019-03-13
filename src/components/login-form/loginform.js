import React, { PureComponent } from "react";
import { Redirect } from "react-router-dom";
import Cookie from "react-cookies";
import { connect } from "react-redux";
import { Form, Button, Card, Checkbox, Input, Dimmer, Loader } from "semantic-ui-react";

//Internal Components
import PasswordInput from "../password-input/passwordinput";

//Logic
import { login } from "../../redux/actions/user";

class LoginForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			rememberMe: false
		};
	}

	componentDidMount = () => {
		const cookie = Cookie.load("userPreferences");
		if (cookie !== undefined) {
			this.setState({
				email: cookie.email,
				rememberMe: cookie.rememberMe
			});
		}
	};

	handleSubmit = event => {
		event.preventDefault();
		this.props.dispatch(login(this.state.email, this.state.password, this.state.rememberMe));
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	handleCheckOnChange = () => {
		this.setState({ rememberMe: !this.state.rememberMe });
	};

	render() {
		const { navigate } = this.props;

		if (this.props.navigation.navigate === true && window.location.pathname !== this.props.navigation.route) {
			return <Redirect push to={this.props.navigation.route} />;
		}

		return (
			<Dimmer.Dimmable blurring dimmed={this.props.user.isFetching}>
				<Dimmer page active={this.props.user.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Card fluid centered className="boxContainer">
					<Card.Content>
						<Card.Header className="font font-22" textAlign="center">
							Enregistrer vos donnees
						</Card.Header>
						<Card.Meta className="font font-16" textAlign="center">
							Rentrez votre email et mot de passe
						</Card.Meta>
						<Form className="spacerTop space-30" size="large">
							<Form.Field>
								<Input
									icon="mail"
									iconPosition="left"
									placeholder="Email"
									name="email"
									value={this.state.email}
									onChange={this.handleInputOnChange}
								/>
							</Form.Field>
							<Form.Field>
								<PasswordInput
									placeholder="Mot de Passe"
									name="password"
									value={this.state.password}
									onChange={this.handleInputOnChange}
								/>
							</Form.Field>
							<Form.Field>
								<div className="row spacerTop space-30">
									<Checkbox
										className="font font-16"
										label="Rappler votre email"
										name="rememberMe"
										checked={this.state.rememberMe}
										onChange={this.handleCheckOnChange}
									/>
									<a className="link" name="forgotpw" href="/" role="button" onClick={navigate}>
										¿Tu as oublié ton mot de passe?
									</a>
								</div>
							</Form.Field>
							<Button
								fluid
								name="login"
								size="large"
								type="submit"
								className="primaryBtn spacerTop space-30"
								onClick={this.handleSubmit}
							>
								Rentrez
							</Button>
						</Form>
					</Card.Content>
				</Card>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ user, navigation }) {
	return { user, navigation };
}

export default connect(mapStateToProps)(LoginForm);
