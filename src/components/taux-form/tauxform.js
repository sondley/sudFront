import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Button, Card, Input, Dimmer, Loader, Message, Icon } from "semantic-ui-react";

//Logic
import { createTaux, modifyTaux } from "../../redux/actions/taux";

//Styles
import styles from "./tauxform.module.css";

class TauxForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			edit: false || this.props.edit,
			nom: "",
			prixVente: "",
			prixAchat: "",
			nomError: false,
			prixVenteError: false,
			prixAchatError: false
		};
	}

	componentDidMount = () => {
		if (this.state.edit) {
			this.setState({
				nom: this.props.data.nom,
				prixVente: this.props.data.prixVente,
				prixAchat: this.props.data.prixAchat
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
		if (name === "prixVente") {
			if (value.length === 0 || value <= 0) {
				return this.setState({
					prixVenteError: true
				});
			} else {
				return this.setState({
					prixVenteError: false
				});
			}
		}
		if (name === "prixAchat") {
			if (value.length === 0 || value <= 0) {
				return this.setState({
					prixAchatError: true
				});
			} else {
				return this.setState({
					prixAchatError: false
				});
			}
		}
	};

	handleSubmit = event => {
		event.preventDefault();
		const { nom, prixAchat, prixVente, nomError, prixAchatError, prixVenteError } = this.state;
		if (nomError || prixAchatError || prixVenteError) {
			return this.setState({ isModalOpen: true });
		}
		if (this.state.edit) {
			const taux = { ...this.props.data, nom, prixAchat, prixVente };
			return this.props.dispatch(modifyTaux(taux, this.props.onClose));
		}
		const taux = { nom, prixAchat, prixVente };
		this.props.dispatch(createTaux(taux, this.props.onClose));
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
			case "prixVente":
				list = ["Le Prix de Vente ne peut pas être vide", "Le Prix de Vente doit être un numero > 0"];
				break;
			case "prixAchat":
				list = ["Le Prix d'Achat ne peut pas être vide", "Le Prix d'Achat doit être un numero > 0"];
				break;
			default:
				list = [];
		}
		return (
			<Message style={this.state[error] ? { display: "block" } : { display: "none" }} error size="small" list={list} />
		);
	};

	render() {
		let title = "Entrain de Ajouter une Monnaie";
		let label = "Ajouter";
		if (this.state.edit) {
			title = "Entrain de Modifier la Monnaie";
			label = "Modifier";
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
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Prix de Vente</label>
										<Input
											type="number"
											icon="money"
											iconPosition="left"
											placeholder="Prix de Vente"
											name="prixVente"
											onChange={this.handleInputOnChange}
											value={this.state.prixVente}
											onKeyUp={this.handleInputError}
											onBlur={this.state.prixVenteError ? null : this.handleInputError}
										/>
										{this.renderMessages("prixVente")}
									</Form.Field>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Prix d'Achat</label>
										<Input
											type="number"
											icon="money"
											iconPosition="left"
											placeholder="Prix d'Achat"
											name="prixAchat"
											onChange={this.handleInputOnChange}
											value={this.state.prixAchat}
											onKeyUp={this.handleInputError}
											onBlur={this.state.prixAchatError ? null : this.handleInputError}
										/>
										{this.renderMessages("prixAchat")}
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

export default connect()(TauxForm);
