import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Button, Card, Input, Dimmer, Loader, Message, Icon } from "semantic-ui-react";

//Logic
import { createTax, modifyTax } from "../../redux/actions/tax";

//Styles
import styles from "./taxform.module.css";

class TaxForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			edit: false || this.props.edit,
			nom: "",
			taxe: "",
			nomError: false,
			taxeError: false,
			isModalOpen: false
		};
	}

	componentDidMount = () => {
		if (this.state.edit) {
			this.setState({ nom: this.props.data.nom, taxe: this.props.data.taxe });
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
		if (name === "taxe") {
			if (value.length === 0 || value <= 0) {
				return this.setState({
					taxeError: true
				});
			} else {
				return this.setState({
					taxeError: false
				});
			}
		}
	};

	handleSubmit = event => {
		event.preventDefault();
		const { nom, taxe, nomError, taxeError } = this.state;
		if (nomError || taxeError) {
			return this.setState({ isModalOpen: true });
		}
		if (this.state.edit) {
			const tax = { ...this.props.data, nom, taxe };
			return this.props.dispatch(modifyTax(tax, this.props.onClose));
		}
		const tax = { nom, taxe };
		this.props.dispatch(createTax(tax, this.props.onClose));
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	handleModalClose = () => {
		this.setState({ isModalOpen: false });
	};

	renderMessages = field => {
		let list = [];
		let error = field.concat("Error");
		switch (field) {
			case "nom":
				list = ["Le Nom ne peut pas être vide"];
				break;
			case "taxe":
				list = ["Le Taxe ne peut pas être vide", "Le Taxe doit être un numero > 0"];
				break;
			default:
				list = [];
		}
		return (
			<Message style={this.state[error] ? { display: "block" } : { display: "none" }} error size="small" list={list} />
		);
	};

	render() {
		let title = "Entrain de Ajouter une Taxe";
		let label = "Ajouter";
		if (this.state.edit) {
			title = "Entrain de Modifier la Taxe";
			label = "Modifier";
		}

		return (
			<Dimmer.Dimmable dimmed={this.state.isModalOpen}>
				<Dimmer verticalAlign="top" page active={this.state.isModalOpen} onClickOutside={this.handleModalClose}>
					{this.state.isModalOpen ? (
						<Message className={styles.dimmerMargin} negative>
							<Message.Item className={styles.noStyleList}>
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
										<label className={styles.basicFormSpacing}>Impôts</label>
										<Input
											type="number"
											icon="law"
											iconPosition="left"
											placeholder="Impôts"
											name="taxe"
											labelPosition="right"
											label="%"
											onChange={this.handleInputOnChange}
											value={this.state.taxe}
											onKeyUp={this.handleInputError}
											onBlur={this.state.taxeError ? null : this.handleInputError}
										/>
										{this.renderMessages("taxe")}
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

export default connect()(TaxForm);
