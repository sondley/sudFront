import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Button, Card, Input, Dimmer, Message, Icon, Select } from "semantic-ui-react";

//Logic
import { createFinance, modifyFinance } from "../../redux/actions/finance";

//Styles
import styles from "./financesform.module.css";

const options = [
	// { text: "Passif a long termes", value: "Passif a long termes" },
	// { text: "Passif a court termes", value: "Passif a court termes" },
	// { text: "Actif a long termes", value: "Actif a long termes" },
	// { text: "Actif a court termes", value: "Actif a court termes" },
	{ text: "Actif", value: "Actif a court termes" },
	{ text: "Passif", value: "Passif a court termes" },
	{ text: "Depenses", value: "Depenses" }
];

class FinancesForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			edit: false || this.props.edit,
			description: "",
			type: "",
			montant: "",
			descriptionError: false,
			typeError: false,
			montantError: false
		};
	}

	componentDidMount = () => {
		if (this.state.edit) {
			this.setState({
				description: this.props.data.description,
				type: this.props.data.type,
				montant: this.props.data.montant
			});
		}
	};

	handleInputError = event => {
		const { name, value } = event.target;
		if (name === "description") {
			if (value.length === 0) {
				return this.setState({
					descriptionError: true
				});
			} else {
				return this.setState({
					descriptionError: false
				});
			}
		}
		if (name === "montant") {
			if (value.length === 0 || value <= 0) {
				return this.setState({
					montantError: true
				});
			} else {
				return this.setState({
					montantError: false
				});
			}
		}
		if (name === "type") {
			if (value.length === 0) {
				return this.setState({
					typeError: true
				});
			} else {
				return this.setState({
					typeError: false
				});
			}
		}
	};

	handleSubmit = event => {
		event.preventDefault();
		const { description, montant, type, descriptionError, montantError, typeError } = this.state;
		if (descriptionError || montantError || typeError) {
			return this.setState({ isModalOpen: true });
		}
		if (this.state.edit) {
			const item = { ...this.props.data, description, montant, type };
			return this.props.dispatch(modifyFinance(item, this.props.onClose));
		}
		const item = { description, montant, type };
		this.props.dispatch(createFinance(item, this.props.onClose));
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	handleSelectChange = (e, { value }) => {
		e.preventDefault();
		this.setState({ type: value });
	};

	renderMessages = field => {
		let list = [];
		let error = field.concat("Error");
		switch (field) {
			case "description":
				list = ["Le Description ne peut pas être vide"];
				break;
			case "montant":
				list = ["Le Montant doit être un numero > 0"];
				break;
			case "type":
				list = ["Le Type ne peut pas être vide"];
				break;
			default:
				list = [];
		}
		return (
			<Message style={this.state[error] ? { display: "block" } : { display: "none" }} error size="small" list={list} />
		);
	};

	render() {
		let title = "Entrain de Ajouter une Finance";
		let label = "Ajouter";
		if (this.state.edit) {
			title = "Entrain de Modifier la Finance";
			label = "Modifier";
		}

		return (
			<Dimmer.Dimmable dimmed={this.state.isModalOpen}>
				<Dimmer verticalAlign="top" page active={this.state.isModalOpen} onClickOutside={this.handleModalClose}>
					<Message className="dimmerMargin" negative>
						<Message.Item className="noStyleList">
							<Icon name="warning sign" size="huge" />
						</Message.Item>
						<Message.Content>
							"Revise y complete correctamente los campos con las informaciones de lugar"
						</Message.Content>
					</Message>
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
										<label className={styles.basicFormSpacing}>Description</label>
										<Input
											icon="user"
											iconPosition="left"
											placeholder="Description"
											name="description"
											onChange={this.handleInputOnChange}
											value={this.state.description}
											onKeyUp={this.handleInputError}
											onBlur={this.state.descriptionError ? null : this.handleInputError}
										/>
										{this.renderMessages("description")}
									</Form.Field>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Type</label>
										<Select
											placeholder="Select a Option"
											name="type"
											onChange={this.handleSelectChange}
											value={this.state.type}
											options={options}
											onKeyUp={this.handleInputError}
											onBlur={this.state.typeError ? null : this.handleInputError}
										/>
										{this.renderMessages("type")}
									</Form.Field>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Montant</label>
										<Input
											type="number"
											icon="money"
											iconPosition="left"
											placeholder="Montant"
											name="montant"
											onChange={this.handleInputOnChange}
											value={this.state.montant}
											onKeyUp={this.handleInputError}
											onBlur={this.state.montantError ? null : this.handleInputError}
										/>
										{this.renderMessages("montant")}
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

export default connect()(FinancesForm);
