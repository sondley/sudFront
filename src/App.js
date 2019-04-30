import React, { PureComponent } from "react";
import { withRouter, Switch } from "react-router-dom";
import { connect } from "react-redux";
import IdleTimer from "react-idle-timer";
import { Dimmer, Loader, Message, Icon, Modal } from "semantic-ui-react";
import { resetError } from "./redux/actions/utils";
import { checkSession, logout, resetToken } from "./redux/actions/user";
import { getCaisseStatus } from "./redux/actions/compte";
import PublicRoute from "./components/public-route/publicroute";
import ProtectedRoute from "./components/protected-route/protectedroute";

//Common Screens
import Dashboard from "./screens/dashboard";
import LoginScreen from "./screens/loginscreen/loginscreen";
import EtatDuCompte from "./screens/etatDuCompte/etatDuCompte";
import Achats from "./screens/achats/achats";
import Ventes from "./screens/ventes/ventes";
import Stock from "./screens/stock/stock";
import Solicitude from "./screens/solicitude/solicitude";
import TauxDeChange from "./screens/tauxDeChange/tauxdechange";
//Caissier Screens
import ValidateSolicitude from "./screens/validateSolicitude/validateSolicitude";
import ValidateCommande from "./screens/validateCommande/validateCommande";
import ValidateTradeCoin from "./screens/validateTradeCoin/validatetradecoin";
import RealiserPaiement from "./screens/realiserPaiement/realiserPaiement";
import VoirTransactions from "./screens/voirTransactions/voirTransactions";
//Vendeur Screens
import Commande from "./screens/commande/commande";
import Produits from "./screens/produits/produits";
import VendorRapports from "./screens/vendorRapports/vendorRapports";
import TradeCoin from "./screens/tradeCoin/tradecoin";
//Comite Screens
import ComiteRapports from "./screens/comiteRapports/comiteRapports";
//Contable Screens
import AccountingRapports from "./screens/accountingRapports/accountingRapports";
import Banque from "./screens/banque/banque";
import ComptesPayer from "./screens/comptesPayer/comptespayer";
import ComptesRecevoir from "./screens/comptesRecevoir/comptesrecevoir";
import Finances from "./screens/finances/finances";
//Assistance Screens
import AssistanceRapports from "./screens/assistanceRapports/assistanceRapports";
import Fournisseurs from "./screens/fournisseurs/fournisseurs";
//Directeur Screens
import DirecteurRapports from "./screens/directeurRapports/directeurRapports";
import Utilisateurs from "./screens/utilisateurs/utilisateurs";
import Salaire from "./screens/salaire/salaire";
import ComiteMonitor from "./screens/comiteMonitor/comiteMonitor";
import Devolution from "./screens/devolution/devolution";
import Impots from "./screens/impots/impots";

//Styles
import styles from "./App.module.css";

class App extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			errorModal: false,
			message: []
		};
		this.idleTimer = null;
		this.props.dispatch(getCaisseStatus());
		this.props.dispatch(checkSession());
	}

	componentDidUpdate = () => {
		this.handleOpenModal();
	};

	onAction = e => {
		if (this.props.isLoggedIn) {
			return this.props.dispatch(resetToken());
		}
	};

	onIdle = e => {
		if (this.props.isLoggedIn) {
			return this.props.dispatch(logout());
		}
	};

	handleCloseModal = e => {
		e.preventDefault();
		e.stopPropagation();
		this.props.dispatch(resetError());
		this.setState({ errorModal: false, message: [] });
	};

	handleOpenModal = () => {
		const {
			user,
			product,
			order,
			provider,
			taux,
			cointrade,
			buy,
			compte,
			sollicitude,
			payment,
			debt,
			tax,
			devolution,
			finance
		} = this.props.state;
		if (user.error) {
			return this.setState({ errorModal: true, message: user.message });
		} else if (product.error) {
			return this.setState({ errorModal: true, message: product.message });
		} else if (order.error) {
			return this.setState({ errorModal: true, message: order.message });
		} else if (provider.error) {
			return this.setState({ errorModal: true, message: provider.message });
		} else if (taux.error) {
			return this.setState({ errorModal: true, message: taux.message });
		} else if (cointrade.error) {
			return this.setState({ errorModal: true, message: cointrade.message });
		} else if (buy.error) {
			return this.setState({ errorModal: true, message: buy.message });
		} else if (compte.error) {
			return this.setState({ errorModal: true, message: compte.message });
		} else if (sollicitude.error) {
			return this.setState({ errorModal: true, message: sollicitude.message });
		} else if (payment.error) {
			return this.setState({ errorModal: true, message: payment.message });
		} else if (debt.error) {
			return this.setState({ errorModal: true, message: debt.message });
		} else if (tax.error) {
			return this.setState({ errorModal: true, message: tax.message });
		} else if (devolution.error) {
			return this.setState({ errorModal: true, message: devolution.message });
		} else if (finance.error) {
			return this.setState({ errorModal: true, message: finance.message });
		} else {
			return this.setState({ errorModal: false });
		}
	};

	renderMessage = message => {
		return (
			<Message className={styles.dimmerMargin} error>
				<Message.Item className={styles.noStyleList}>
					<Icon name="warning sign" size="huge" />
				</Message.Item>
				<Message.List items={message} className={styles.paddingBottom} />
			</Message>
		);
	};

	render() {
		const { isLoggedIn } = this.props;
		const { user } = this.props.state;
		if (user.authedUser !== undefined) {
			return (
				<Dimmer.Dimmable blurring dimmed={user.isFetching}>
					<Dimmer page active={user.isFetching}>
						<Loader size="huge">Loading...</Loader>
					</Dimmer>
					<Modal open={this.state.errorModal} onClose={this.handleCloseModal} className={styles.dimmerMargin}>
						{this.renderMessage(this.state.message)}
					</Modal>
					<div id="App" className="App">
						<IdleTimer
							ref={ref => {
								this.idleTimer = ref;
							}}
							element={document}
							onIdle={this.onIdle}
							onAction={this.onAction}
							throttle={1000 * 60 * 45}
							timeout={1000 * 60 * 60}
						/>
						<Switch>
							<PublicRoute isLoggedIn={isLoggedIn} user={user.authedUser} exact path={"/"} component={LoginScreen} />
							<PublicRoute isLoggedIn={isLoggedIn} user={user.authedUser} path={"/login"} component={LoginScreen} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/dashboard"} component={Dashboard} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/validate_solicitude"} component={ValidateSolicitude} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/validate_order"} component={ValidateCommande} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/payment"} component={RealiserPaiement} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/view_transactions"} component={VoirTransactions} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/orders"} component={Commande} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/products"} component={Produits} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/vendor_reports"} component={VendorRapports} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/comite_reports"} component={ComiteRapports} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/cash_status"} component={EtatDuCompte} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/buys"} component={Achats} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/sales"} component={Ventes} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/banking"} component={Banque} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/accounting_reports"} component={AccountingRapports} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/warehouse"} component={Stock} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/suppliers"} component={Fournisseurs} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/assistance_reports"} component={AssistanceRapports} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/director_reports"} component={DirecteurRapports} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/users"} component={Utilisateurs} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/salary"} component={Salaire} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/solicitude"} component={Solicitude} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/comite_monitor"} component={ComiteMonitor} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/exchange_rate"} component={TauxDeChange} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/trade_coin"} component={TradeCoin} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/validate_tradecoin"} component={ValidateTradeCoin} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/devolution"} component={Devolution} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/debt_payable"} component={ComptesPayer} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/debt_recievable"} component={ComptesRecevoir} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/taxes"} component={Impots} />
							<ProtectedRoute isLoggedIn={isLoggedIn} path={"/finances"} component={Finances} />
						</Switch>
					</div>
				</Dimmer.Dimmable>
			);
		} else {
			return (
				<Dimmer.Dimmable blurring dimmed={true}>
					<Dimmer page active={true}>
						<Loader size="huge">Loading...</Loader>
					</Dimmer>
				</Dimmer.Dimmable>
			);
		}
	}
}

function mapStateToProps(state) {
	return { state, isLoggedIn: state.user.authedUser !== null };
}

export default withRouter(connect(mapStateToProps)(App));
