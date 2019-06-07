import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Message, Dimmer, Icon, Card, Select, Modal } from "semantic-ui-react";
import { createCoinTrade, modifyCoinTrade } from "../../redux/actions/cointrades";
import { getTauxs } from "../../redux/actions/taux";
import { isEmpty, filter, find } from "lodash";

//Styles
import styles from "./cointradeform.module.css";

class CoinTradeForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			edit: false || this.props.edit,
			headerErrorMessage: "",
			type: "" || this.props.type,
			clientName: "",
			quantite: "",
			monnaie: "",
			clientNameError: false,
			quantiteError: false,
			monnaieError: false,
			formError: false,
			isModalOpen: false,
			helpModal: false,
			results: [],
			item: {},
			isLoading: false
		};
	}

	async componentDidMount() {
		if (isEmpty(this.props.taux.monnaies)) {
			await this.props.dispatch(getTauxs());
		}
		if (this.state.edit) {
			const coin = filter(this.props.taux.monnaies, { nom: this.props.data.monnaie });
			this.setState({
				clientName: this.props.data.client,
				quantite: this.props.data.quantite,
				monnaie: coin[0]._id,
				type: this.props.data.type
			});
		}
	}

	handleChange = event => {
		event.preventDefault();
		const { name, value } = event.target;
		if (name === "quantite" && parseInt(value) < 0) {
			return this.setState({ [name]: 0 });
		}
		this.setState({ [name]: value });
	};

	handleSelectChange = (e, { value }) => {
		e.preventDefault();
		this.setState({ monnaie: value });
	};

	handleModalClose = () => {
		this.setState({ isModalOpen: false });
	};

	handleFullClose = () => {
		this.setState({ helpModal: false });
		this.props.onClose();
	};

	handleInputError = event => {
		const { name, value } = event.target;
		if (name === "clientName") {
			if (value.length === 0) {
				return this.setState({
					clientNameError: true,
					formError: true
				});
			} else {
				return this.setState({
					clientNameError: false,
					formError: false
				});
			}
		}
		if (name === "monnaie") {
			if (value.length === 0) {
				return this.setState({
					monnaieError: true,
					formError: true
				});
			} else {
				return this.setState({
					monnaieError: false,
					formError: false
				});
			}
		}
		if (name === "quantite") {
			const numVal = parseInt(value);
			if (value.length === 0 || numVal <= 0) {
				return this.setState({
					quantiteError: true,
					formError: true
				});
			} else {
				return this.setState({
					quantiteError: false,
					formError: false
				});
			}
		}
	};

	handleSubmit = async event => {
		event.preventDefault();
		const { clientName, quantite, monnaie, type } = this.state;
		if (!this.state.formError) {
			if (this.state.edit) {
				const coinTrade = {
					...this.props.data,
					client: clientName,
					quantite,
					monnaie,
					idVendeur: this.props.user.authedUser._id,
					type
				};
				this.props.dispatch(modifyCoinTrade(coinTrade));
				return this.setState({ helpModal: true });
			}
			const coinTrade = {
				client: clientName,
				quantite,
				monnaie,
				idVendeur: this.props.user.authedUser._id,
				type
			};
			this.props.dispatch(createCoinTrade(coinTrade));
			return this.setState({ helpModal: true });
		} else {
			this.setState({ isModalOpen: true });
		}
	};

	renderMessages = field => {
		let list = [];
		let error = field.concat("Error");
		switch (field) {
			case "clientName":
				list = ["Le Nom du Client ne peut pas être vide"];
				break;
			case "monnaie":
				list = ["Tu dois sélectionner une monnaie"];
				break;
			case "quantite":
				list = ["La Quantité ne peut pas être vide", "La Quantité doit être un numero > 0"];
				break;
			default:
				list = [];
		}
		return (
			<Message style={this.state[error] ? { display: "block" } : { display: "none" }} error size="small" list={list} />
		);
	};

	renderModal = isOpen => {
		let Monnaie = find(this.props.taux.monnaies, { _id: this.state.monnaie });
		let Recevoir = "";
		let Payer = "";
		if (Monnaie !== undefined) {
			Recevoir =
				this.state.type === "vendre"
					? "$" + this.state.quantite + " HTD"
					: "$" + this.state.quantite + " " + Monnaie.nom;
			Payer =
				this.state.type === "vendre"
					? "$" + this.state.quantite / Monnaie.prixVente + " " + Monnaie.nom
					: "$" + this.state.quantite * Monnaie.prixAchat + " HTD";
		}

		return (
			<Modal open={isOpen} onClose={this.handleFullClose} size="small">
				<Modal.Content>
					<Form>
						<Form.Field className={styles.centered}>
							Montant a Recevoir: <strong>{Recevoir}</strong>
						</Form.Field>
						<Form.Field className={styles.centered}>
							Montant a Payer: <strong>{Payer}</strong>
						</Form.Field>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button primary content="Ok" onClick={this.handleFullClose} />
				</Modal.Actions>
			</Modal>
		);
	};

	render() {
		const options =
			this.state.type === "vendre"
				? this.props.taux.monnaies.map(item => {
						return { text: item.nom + " $" + item.prixVente + " HTD", value: item._id };
				  })
				: this.props.taux.monnaies.map(item => {
						return { text: item.nom + " $" + item.prixAchat + " HTD", value: item._id };
				  });
		let title = "Entrain de Ajouter";
		let label = "Ajouter";
		if (this.state.edit) {
			title = "Entrain de Modifier";
			label = "Modifier";
		}
		let QuantiteLabel = this.state.type === "vendre" ? "Quantite en Gourde" : "Quantite";

		return (
			<Dimmer.Dimmable dimmed={this.state.isModalOpen}>
				<Dimmer verticalAlign="top" active={this.state.isModalOpen} page onClickOutside={this.handleModalClose}>
					<Message className={styles.dimmerMargin} negative>
						<Message.Item className={styles.noStyleList}>
							<Icon name="warning sign" size="huge" />
						</Message.Item>
						<Message.Header>{this.state.headerErrorMessage}</Message.Header>
						<Message.Content>{this.state.contentErrorMessage}</Message.Content>
					</Message>
				</Dimmer>
				{this.renderModal(this.state.helpModal)}
				<Card fluid centered className={styles.boxContainerWide}>
					<Card.Content>
						<Card.Header className="font font-18" textAlign="center">
							{title}
						</Card.Header>
						<Card.Meta className="font font-16" textAlign="center">
							Completer les champs du formulaire
						</Card.Meta>
						<div className={styles.basicFormContainer}>
							<Form className={styles.basicFormWidth}>
								<Form.Group grouped>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Nom du Client</label>
										<Input
											icon="code"
											iconPosition="left"
											placeholder="Nom du Client"
											name="clientName"
											onChange={this.handleChange}
											value={this.state.clientName}
											onKeyUp={this.handleInputError}
											onBlur={this.state.clientNameError ? null : this.handleInputError}
										/>
										{this.renderMessages("clientName")}
									</Form.Field>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Monnaie</label>
										<Select
											options={options}
											placeholder="Monnaie"
											name="monnaie"
											onChange={this.handleSelectChange}
											value={this.state.monnaie}
											onKeyUp={this.handleInputError}
											onBlur={this.state.monnaieError ? null : this.handleInputError}
										/>
										{this.renderMessages("monnaie")}
									</Form.Field>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>{QuantiteLabel}</label>
										<Input
											type="number"
											icon="archive"
											iconPosition="left"
											placeholder={QuantiteLabel}
											name="quantite"
											onChange={this.handleChange}
											value={this.state.quantite}
											onKeyUp={this.handleInputError}
											onBlur={this.state.quantiteError ? null : this.handleInputError}
										/>
										{this.renderMessages("quantite")}
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

function mapStateToProps({ taux, user }) {
	return { taux, user };
}

export default connect(mapStateToProps)(CoinTradeForm);
