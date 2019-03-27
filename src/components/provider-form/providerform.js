import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Button, Card, Input, Dimmer, Loader, Message, Icon, TextArea } from "semantic-ui-react";

//Logic
import { createProvider, modifyProvider } from "../../redux/actions/provider";

//Styles
import styles from "./providerform.module.css";

class ProviderForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			edit: false || this.props.edit,
			view: false || this.props.view,
			nom: "",
			email: "",
			tel: "",
			addresse: "",
			nomError: false,
			emailError: false
		};
	}

	componentDidMount = () => {
		if (this.state.edit || this.state.view) {
			this.setState({
				nom: this.props.data.nom,
				email: this.props.data.email,
				tel: this.props.data.tel === null ? "" : this.props.data.tel,
				addresse: this.props.data.addresse
			});
		}
	};

	handleInputError = event => {
		const { name, value } = event.target;
		if (name === "nom") {
			if (value.length === 0) {
				return this.setState({
					nomError: true
				});
			} else {
				return this.setState({
					nomError: false
				});
			}
		}
	};

	handleSubmit = event => {
		event.preventDefault();
		const { nom, email, tel, addresse, nomError, emailError } = this.state;
		if (nomError || emailError) {
			return this.setState({ isModalOpen: true });
		}
		if (this.state.edit) {
			const provider = {
				...this.props.data,
				nom,
				email,
				tel,
				addresse
			};
			return this.props.dispatch(modifyProvider(provider, this.props.onClose));
		}
		const provider = { nom, email, tel, addresse };
		this.props.dispatch(createProvider(provider, this.props.onClose));
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	renderMessages = field => {
		let list = [];
		let error = field.concat("Error");
		switch (field) {
			case "nom":
				list = ["Le Nom ne peut pas être vide"];
				break;
			case "email":
				list = ["L'Email n'est pas valide"];
				break;
			default:
				list = [];
		}
		return (
			<Message style={this.state[error] ? { display: "block" } : { display: "none" }} error size="small" list={list} />
		);
	};

	render() {
		let title = "Entrain de Ajouter un Fournisseur";
		let label = "Ajouter";
		if (this.state.edit) {
			title = "Entrain de Modifier le Fournisseur";
			label = "Modifier";
		} else if (this.state.view) {
			title = "Entrain de Voir le Fournisseur";
		}

		return (
			<Dimmer.Dimmable dimmed={this.state.isModalOpen}>
				<Dimmer verticalAlign="top" page active={this.state.isModalOpen} onClickOutside={this.handleModalClose}>
					{this.state.isModalOpen ? (
						<Message className="dimmerMargin" negative>
							<Message.Item className="noStyleList">
								<Icon name="warning sign" size="huge" />
							</Message.Item>
							<Message.Content>
								"Revise y complete correctamente los campos con las informaciones de lugar"
							</Message.Content>
						</Message>
					) : (
						<Loader size="huge">Loading...</Loader>
					)}
				</Dimmer>
				<Card fluid centered className={styles.boxContainerWide}>
					<Card.Content>
						<Card.Header className="font font-18" textAlign="center">
							{title}
						</Card.Header>
						<div className={styles.basicFormContainer}>
							<Form size="small" className={styles.fullWidth}>
								<Form.Group grouped>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Nom</label>
										<Input
											disabled={this.state.view}
											icon="user"
											iconPosition="left"
											placeholder="Nom"
											name="nom"
											onChange={this.handleInputOnChange}
											value={this.state.nom}
											onKeyUp={this.handleInputError}
											onBlur={this.state.nomError ? null : this.handleInputError}
										/>
										{this.renderMessages("nom")}
									</Form.Field>
									<Form.Field>
										<label className={styles.basicFormSpacing}>Email</label>
										<Input
											disabled={this.state.view}
											icon="mail"
											iconPosition="left"
											placeholder="Email"
											name="email"
											onChange={this.handleInputOnChange}
											value={this.state.email}
										/>
									</Form.Field>
									<Form.Field>
										<label className={styles.basicFormSpacing}>Telephone</label>
										<Input
											disabled={this.state.view}
											icon="phone"
											iconPosition="left"
											placeholder="Telephone"
											name="tel"
											onChange={this.handleInputOnChange}
											value={this.state.tel}
										/>
									</Form.Field>
									<Form.Field>
										<label className={styles.basicFormSpacing}>Addresse</label>
										<TextArea
											size="small"
											disabled={this.state.view}
											name="addresse"
											onChange={this.handleInputOnChange}
											rows={4}
											placeholder="Addresse"
											value={this.state.addresse}
										/>
									</Form.Field>
								</Form.Group>
							</Form>
						</div>
						<div style={this.state.view ? { display: "none" } : { display: "block" }}>
							<Button fluid size="small" color="teal" content={label} onClick={this.handleSubmit} />
						</div>
					</Card.Content>
				</Card>
			</Dimmer.Dimmable>
		);
	}
}

export default connect()(ProviderForm);
