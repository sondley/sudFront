import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Button, Card, Input, Dimmer, Loader, Message, Icon, TextArea } from "semantic-ui-react";

//Logic
import { createSollicitude, modifySollicitude } from "../../redux/actions/sollicitude";

//Styles
import styles from "./sollicitudeform.module.css";

class SollicitudeForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			edit: false || this.props.edit,
			view: false || this.props.view,
			quantite: "",
			description: "",
			quantiteError: false,
			descriptionError: false
		};
	}

	componentDidMount = () => {
		if (this.state.edit || this.state.view) {
			this.setState({ quantite: this.props.data.quantite, description: this.props.data.description });
		}
	};

	handleInputError = event => {
		const { name, value } = event.target;
		if (name === "quantite") {
			if (value.length === 0 || value <= 0) {
				return this.setState({
					quantiteError: true
				});
			} else {
				return this.setState({
					quantiteError: false
				});
			}
		}
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
	};

	handleSubmit = event => {
		event.preventDefault();
		const { quantite, quantiteError, description, descriptionError } = this.state;
		const { _id } = this.props.user.authedUser;
		if (quantiteError || descriptionError) {
			return this.setState({ isModalOpen: true });
		}
		if (this.state.edit) {
			const sollicitude = { ...this.props.data, quantite, description, idUser: _id };
			return this.props.dispatch(modifySollicitude(sollicitude, this.props.onClose));
		}
		const sollicitude = { quantite, description, idUser: _id };
		this.props.dispatch(createSollicitude(sollicitude, this.props.onClose));
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		if (name === "quantite" && parseInt(value) < 0) {
			return this.setState({ [name]: 0 });
		}
		this.setState({ [name]: value });
	};

	renderMessages = field => {
		let list = [];
		let error = field.concat("Error");
		switch (field) {
			case "quantite":
				list = ["La Quantité ne peut pas être vide", "La Quantité doit être un numero > 0"];
				break;
			case "description":
				list = ["La Description ne peut pas être vide"];
				break;
			default:
				list = [];
		}
		return (
			<Message style={this.state[error] ? { display: "block" } : { display: "none" }} error size="small" list={list} />
		);
	};

	render() {
		let title = "Entrain de Ajouter une Sollicitude";
		let label = "Ajouter";
		if (this.state.edit) {
			title = "Entrain de Modifier la Sollicitude";
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
										<label className={styles.basicFormSpacing}>Montant</label>
										<Input
											disabled={this.state.view}
											type="number"
											icon="money"
											iconPosition="left"
											placeholder="Montant"
											name="quantite"
											onChange={this.handleInputOnChange}
											value={this.state.quantite}
											onKeyUp={this.handleInputError}
											onBlur={this.state.quantiteError ? null : this.handleInputError}
										/>
										{this.renderMessages("quantite")}
									</Form.Field>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Description</label>
										<TextArea
											disabled={this.state.view}
											rows={3}
											placeholder="Description"
											name="description"
											onChange={this.handleInputOnChange}
											value={this.state.description}
											onKeyUp={this.handleInputError}
											onBlur={this.state.descriptionError ? null : this.handleInputError}
										/>
										{this.renderMessages("description")}
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

function mapStateToProps({ user }) {
	return { user };
}

export default connect(mapStateToProps)(SollicitudeForm);
