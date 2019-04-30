import React, { PureComponent } from "react";
import { Button, Icon, Grid, Modal, Input, Dimmer, Search, Form } from "semantic-ui-react";
import { connect } from "react-redux";
import { escapeRegExp, filter, debounce, slice } from "lodash";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import CompteTable from "../../components/compte-table/comptetable";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";
import { OpenCaisse, CloseCaisse } from "../../redux/actions/compte";
import { getUsers } from "../../redux/actions/user";

//Styles
import styles from "./etatducompte.module.css";

class EtatDuCompte extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			openCaisseModal: false,
			closeCaisseModal: false,
			vendeur: "",
			idVendeur: "",
			quantiteDonnee: "",
			vendeurListe: [],
			results: [],
			isLoading: false
		};
		if (this.props.navigation.navigate) {
			this.props.dispatch(endNavigation());
		}
		this.props.dispatch(getPageIndexByRoute(window.location.pathname));
	}

	componentDidMount = async () => {
		await this.props.dispatch(getUsers());
		const vendeurListe = filter(this.props.user.users, { role: "vendeur" });
		this.setState({ vendeurListe });
	};

	resetComponent = name => this.setState({ isLoading: false, results: [], [name]: "" });

	handleResultSelect = (e, data) => {
		return this.setState({ results: [], vendeur: data.result.title, idVendeur: data.result.id });
	};

	handleSearchChange = (e, { value, name }) => {
		this.setState({ [name]: value, isLoading: true });

		setTimeout(() => {
			if (this.state[name].length < 1) return this.resetComponent(name);
			let source = this.state.vendeurListe.map(item => {
				return { id: item._id, title: item.prenom + " " + item.nom };
			});
			let trimmedString = new RegExp(escapeRegExp(this.state[name]), "i");
			const isMatch = result => trimmedString.test(result.title);
			const matchedResults = filter(source, isMatch);
			const limitedResults = slice(matchedResults, 0, 5);
			return this.setState({
				isLoading: false,
				results: limitedResults
			});
		}, 500);
	};

	handleOpenCaisse = e => {
		e.preventDefault();
		this.setState({ openCaisseModal: true });
	};

	handleCloseCaisse = e => {
		e.preventDefault();
		this.setState({ closeCaisseModal: true });
	};

	handleCloseModal = () => {
		this.setState({ closeCaisseModal: false, openCaisseModal: false });
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		if (parseInt(value) < 0) {
			return this.setState({ [name]: 0 });
		} else {
			return this.setState({ [name]: parseInt(value) });
		}
	};

	handleSubmit = () => {
		const { openCaisseModal, idVendeur, quantiteDonnee } = this.state;
		const { authedUser } = this.props.user;
		const { moneyCompte } = this.props.compte;
		if (openCaisseModal) {
			//Open
			const item = { idVendeur, quantiteDonnee };
			return this.props.dispatch(OpenCaisse(item, this.handleCloseModal));
		}
		//Close
		const item = { idUser: authedUser._id, quantiteRemise: moneyCompte };
		return this.props.dispatch(CloseCaisse(item, this.handleCloseModal));
	};

	renderOpenModal = isOpen => {
		if (isOpen) {
			return (
				<Modal size="small" open={isOpen} onClose={this.handleCloseModal}>
					<Modal.Header>Ouvrir Caisse</Modal.Header>
					<Modal.Content>
						<Form>
							<Form.Field required>
								<label className={styles.basicFormSpacing}>Chercher un Vendeur</label>
								<Search
									input={{ icon: "search", iconPosition: "left" }}
									size="small"
									placeholder="Chercher un Vendeur"
									loading={this.state.isLoading}
									onResultSelect={this.handleResultSelect}
									onSearchChange={debounce(this.handleSearchChange, 500, {
										leading: true
									})}
									results={this.state.results}
									value={this.state.vendeur}
									name="vendeur"
								/>
							</Form.Field>
							<Form.Field required>
								<label className={styles.basicFormSpacing}>Quantité Donnée</label>
								<Input
									icon="money"
									iconPosition="left"
									placeholder="Quantité Donnée"
									name="quantiteDonnee"
									type="number"
									onChange={this.handleInputOnChange}
									value={this.state.quantiteDonnee}
								/>
							</Form.Field>
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button
							className={styles.rightSpacing}
							negative
							icon="cancel"
							labelPosition="right"
							content="Non"
							onClick={this.handleCloseModal}
						/>
						<Button
							className={styles.leftSpacing}
							positive
							icon="checkmark"
							labelPosition="right"
							content="Oui"
							onClick={this.handleSubmit}
						/>
					</Modal.Actions>
				</Modal>
			);
		}
	};

	renderCloseModal = isOpen => {
		if (isOpen) {
			return (
				<Modal size="small" open={isOpen} onClose={this.handleCloseModal}>
					<Modal.Header>Fermer Caisse</Modal.Header>
					<Modal.Content>
						<p>êtes vous sure que vous voulez l'eliminer?</p>
					</Modal.Content>
					<Modal.Actions>
						<Button
							className={styles.rightSpacing}
							negative
							icon="cancel"
							labelPosition="right"
							content="Non"
							onClick={this.handleCloseModal}
						/>
						<Button
							className={styles.leftSpacing}
							positive
							icon="checkmark"
							labelPosition="right"
							content="Oui"
							onClick={this.handleSubmit}
						/>
					</Modal.Actions>
				</Modal>
			);
		}
	};

	render() {
		const { openCaisseModal, closeCaisseModal } = this.state;
		const { moneyCompte, caisse } = this.props.compte;
		const { role } = this.props.user.authedUser;
		const etatDuCompte = caisse.etat === "1" ? "C'est Ouverte" : "C'est Fermée";
		return (
			<Dimmer.Dimmable blurring dimmed={openCaisseModal || closeCaisseModal}>
				{this.renderOpenModal(openCaisseModal)}
				{this.renderCloseModal(closeCaisseModal)}
				<CustomMenu screenName="Etat du Compte">
					<div>
						<Grid className={styles.noMarginBottom}>
							<Grid.Row style={role === "contable" ? { display: "block" } : { display: "none" }}>
								<Grid.Column width={16} floated="right" className={styles.rightAligned}>
									<div className={styles.buttonSpacing}>
										<Button
											icon
											labelPosition="left"
											color="brown"
											size="small"
											onClick={this.handleOpenCaisse}
											disabled={caisse.etat === "1" || caisse.dateFermer !== ""}
										>
											<Icon name="sign-in" /> Ouverture du Caisse
										</Button>
										<Button
											icon
											labelPosition="left"
											color="green"
											size="small"
											onClick={this.handleCloseCaisse}
											disabled={caisse.etat === "0"}
										>
											<Icon name="sign-out" /> Fermeture du Caisse
										</Button>
									</div>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column textAlign="center">
									<label className={styles.moneyTitle}>Etat Du Compte: {etatDuCompte}</label>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column textAlign="center">
									<label className={styles.moneyTitle}>Argent Disponible: ${moneyCompte}.00 HTD</label>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>
									<CompteTable />
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</div>
				</CustomMenu>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ navigation, compte, user }) {
	return { navigation, compte, user };
}

export default connect(mapStateToProps)(EtatDuCompte);
