import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Button, Card, Input, Dimmer, Loader, Message, Icon, Divider, TextArea, Select } from "semantic-ui-react";

//Components
import PasswordInput from "../password-input/passwordinput";

//Logic
import { createUser, modifyUser } from "../../redux/actions/user";

//Styles
import styles from "./registerform.module.css";

const roles = [
	{ text: "Vendeur", value: "vendeur" },
	{ text: "Caissier", value: "caissier" },
	{ text: "Comite", value: "comite" },
	{ text: "Comptable", value: "contable" },
	{ text: "Assistance", value: "assistance" },
	{ text: "Directeur", value: "directeur" }
];

class RegisterForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			edit: false || this.props.edit,
			view: false || this.props.view,
			nom: "",
			prenom: "",
			email: "",
			tel: "",
			etatCivile: "",
			salaire: "",
			role: "",
			addresse: "",
			dateDeNaissance: "",
			motDePasse: "",
			nomError: false,
			prenomError: false,
			emailError: false,
			salaireError: false,
			roleError: false,
			motDePasseError: false
		};
	}

	componentDidMount = () => {
		if (this.state.edit || this.state.view) {
			const day = new Date(this.props.data.dateDeNaissance).getDate();
			const month = new Date(this.props.data.dateDeNaissance).getMonth() + 1;
			const year = new Date(this.props.data.dateDeNaissance).getFullYear();
			let dateString = month < 10 ? year + "-0" + month + "-" + day : year + "-" + month + "-" + day;
			this.setState({
				nom: this.props.data.nom,
				prenom: this.props.data.prenom,
				email: this.props.data.email,
				tel: this.props.data.tel === null ? "" : this.props.data.tel,
				etatCivile: this.props.data.etatCivile,
				salaire: this.props.data.salaire,
				role: this.props.data.role,
				addresse: this.props.data.addresse,
				dateDeNaissance: this.props.data.dateDeNaissance === null ? "" : dateString
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

		if (name === "prenom") {
			if (value.length === 0) {
				return this.setState({
					prenomError: true
				});
			} else {
				return this.setState({
					prenomError: false
				});
			}
		}

		if (name === "salaire") {
			if (value.length === 0) {
				return this.setState({
					salaireError: true
				});
			} else {
				return this.setState({
					salaireError: false
				});
			}
		}

		if (name === "motDePasse") {
			if (value.length === 0) {
				return this.setState({
					motDePasseError: true
				});
			} else {
				return this.setState({
					motDePasseError: false
				});
			}
		}

		if (name === "role") {
			if (value.length === 0) {
				return this.setState({
					roleError: true
				});
			} else {
				return this.setState({
					roleError: false
				});
			}
		}

		if (name === "email") {
			let mail = value.match(
				new RegExp(
					"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
				)
			);

			if (value.length === 0 || mail === null) {
				return this.setState({
					emailError: true
				});
			} else {
				return this.setState({
					emailError: false
				});
			}
		}
	};

	handleSubmit = event => {
		event.preventDefault();
		const {
			nom,
			prenom,
			email,
			tel,
			etatCivile,
			salaire,
			role,
			addresse,
			dateDeNaissance,
			motDePasse,
			nomError,
			prenomError,
			emailError,
			salaireError,
			roleError,
			motDePasseError
		} = this.state;
		if (nomError || prenomError || salaireError || roleError || motDePasseError || emailError) {
			return this.setState({ isModalOpen: true });
		}
		if (this.state.edit) {
			const user = {
				...this.props.data,
				nom,
				prenom,
				email,
				tel,
				etatCivile,
				salaire,
				role,
				addresse,
				dateDeNaissance,
				motDePasse
			};
			return this.props.dispatch(modifyUser(user, this.props.onClose));
		}
		const user = { nom, prenom, email, tel, etatCivile, salaire, role, addresse, dateDeNaissance, motDePasse };
		this.props.dispatch(createUser(user, this.props.onClose));
	};

	handleSelectChange = (e, { value }) => {
		e.preventDefault();
		this.setState({ role: value });
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	renderMessages = field => {
		let list = [];
		let error = field.concat("Error");
		switch (field) {
			case "prenom":
				list = ["Le Prenom ne peut pas être vide"];
				break;
			case "nom":
				list = ["Le Nom ne peut pas être vide"];
				break;
			case "salaire":
				list = ["Le Salaire ne peut pas être vide"];
				break;
			case "role":
				list = ["Le Role ne peut pas être vide"];
				break;
			case "motDePasse":
				list = ["Le Mot de Passe ne peut pas être vide"];
				break;
			case "email":
				list = ["L'Email ne peut pas être vide", "L'Email n'est pas valide"];
				break;
			default:
				list = [];
		}
		return (
			<Message style={this.state[error] ? { display: "block" } : { display: "none" }} error size="small" list={list} />
		);
	};

	render() {
		let title = "Entrain de Ajouter un Utilisateur";
		let label = "Ajouter";
		if (this.state.edit) {
			title = "Entrain de Modifier le Utilisateur";
			label = "Modifier";
		} else if (this.state.view) {
			title = "Entrain de Voir le Utilisateur";
		}

		return (
			<Dimmer.Dimmable dimmed={this.props.user.isFetching || this.state.isModalOpen}>
				<Dimmer
					verticalAlign="top"
					page
					active={this.props.user.isFetching || this.state.isModalOpen}
					onClickOutside={this.handleModalClose}
				>
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
							<div className={styles.basicFormSecond}>
								<Divider horizontal>Informations requises</Divider>
								<Form size="small">
									<Form.Group grouped>
										<Form.Field required>
											<label className={styles.basicFormSpacing}>Prenom</label>
											<Input
												disabled={this.state.view}
												icon="user"
												iconPosition="left"
												placeholder="Prenom"
												name="prenom"
												onChange={this.handleInputOnChange}
												value={this.state.prenom}
												onKeyUp={this.handleInputError}
												onBlur={this.state.prenomError ? null : this.handleInputError}
											/>
											{this.renderMessages("prenom")}
										</Form.Field>
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
										<Form.Field required>
											<label className={styles.basicFormSpacing}>Email</label>
											<Input
												disabled={this.state.view}
												icon="mail"
												iconPosition="left"
												placeholder="Email"
												name="email"
												onChange={this.handleInputOnChange}
												value={this.state.email}
												onKeyUp={this.handleInputError}
												onBlur={this.state.emailError ? null : this.handleInputError}
											/>
											{this.renderMessages("email")}
										</Form.Field>
										<Form.Field required>
											<label className={styles.basicFormSpacing}>Role</label>
											<Select
												disabled={this.state.view}
												placeholder="Role"
												name="role"
												options={roles}
												onChange={this.handleSelectChange}
												value={this.state.role}
												onKeyUp={this.handleInputError}
												onBlur={this.state.roleError ? null : this.handleInputError}
											/>
											{this.renderMessages("role")}
										</Form.Field>
										<Form.Field required>
											<label className={styles.basicFormSpacing}>Salaire</label>
											<Input
												disabled={this.state.view}
												icon="money"
												iconPosition="left"
												placeholder="Salaire"
												name="salaire"
												onChange={this.handleInputOnChange}
												value={this.state.salaire}
												onKeyUp={this.handleInputError}
												onBlur={this.state.salaireError ? null : this.handleInputError}
											/>
											{this.renderMessages("salaire")}
										</Form.Field>
										<Form.Field required>
											<label className={styles.basicFormSpacing}>Mot De Passe</label>
											<PasswordInput
												disabled={this.state.view}
												placeholder="Mot de Passe"
												name="motDePasse"
												value={this.state.motDePasse}
												onChange={this.handleInputOnChange}
												onBlur={this.motDePasseError ? null : this.handleInputError}
												onKeyUp={this.handleInputError}
											/>
											{this.renderMessages("motDePasse")}
										</Form.Field>
									</Form.Group>
								</Form>
							</div>
							<div className={styles.basicFormSecond}>
								<Divider horizontal>Informations personnelles</Divider>
								<Form size="small">
									<Form.Group grouped>
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
											<label className={styles.basicFormSpacing}>Date de Naissance</label>
											<Input
												disabled={this.state.view}
												icon="calendar alternate outline"
												iconPosition="left"
												placeholder="Date de Naissance"
												name="dateDeNaissance"
												type="date"
												onChange={this.handleInputOnChange}
												value={this.state.dateDeNaissance}
											/>
										</Form.Field>
										<Form.Field>
											<label className={styles.basicFormSpacing}>Etat Civile</label>
											<Input
												disabled={this.state.view}
												icon="address card"
												iconPosition="left"
												placeholder="Etat Civile"
												name="etatCivile"
												onChange={this.handleInputOnChange}
												value={this.state.etatCivile}
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

export default connect(mapStateToProps)(RegisterForm);
