import React, { PureComponent } from "react";
import { Grid, Button, Modal, Dimmer, Loader } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import BNRReport from "../../components/BNRRapport/bnrrapport";
import BalanceReport from "../../components/BalanceRapport/balancerapport";
import ResultatReport from "../../components/ResultatRapport/resultatrapport";
//import Receipt from "../../components/receipt/receipt";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";
import { getAllData } from "../../redux/actions/finance";

// const data = {
// 	numero: 5,
// 	totalDonne: 1500,
// 	totalFinal: 1500,
// 	client: "Jason",
// 	vendeur: "Sondley",
// 	arrayOrden: [
// 		{
// 			_id: "abc123",
// 			quantite: 5,
// 			nom: "riz",
// 			prixUnite: 300,
// 			total: 1500
// 		}
// 	]
// };

class AccountingRapports extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			bnrModal: false,
			bilanModal: false,
			resultatModal: false
		};
		if (this.props.navigation.navigate) {
			this.props.dispatch(endNavigation());
		}
		this.props.dispatch(getPageIndexByRoute(window.location.pathname));
	}

	componentDidMount = async () => {
		await this.props.dispatch(getAllData());
	};

	handleCloseModal = () => {
		this.setState({ bnrModal: false, bilanModal: false, resultatModal: false });
	};

	generateBNRReport = e => {
		e.preventDefault();
		this.setState({ bnrModal: true });
	};

	generateBilanReport = e => {
		e.preventDefault();
		this.setState({ bilanModal: true });
	};

	generateResultatReport = e => {
		e.preventDefault();
		this.setState({ resultatModal: true });
	};

	render() {
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.finance.isFetching}>
				<Dimmer page active={this.props.finance.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.bnrModal} onClose={this.handleCloseModal}>
					<BNRReport />
				</Modal>
				<Modal open={this.state.bilanModal} onClose={this.handleCloseModal}>
					<BalanceReport />
				</Modal>
				<Modal open={this.state.resultatModal} onClose={this.handleCloseModal}>
					<ResultatReport />
				</Modal>
				<CustomMenu screenName="Rapports">
					<Grid>
						<Grid.Row>
							<Grid.Column>
								<Button content="générer un rapport de BNR" primary onClick={this.generateBNRReport} />
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Button content="générer un rapport des bilan" primary onClick={this.generateBilanReport} />
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Button
									content="générer un rapport des état de résultats"
									primary
									onClick={this.generateResultatReport}
								/>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</CustomMenu>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ navigation, finance }) {
	return { navigation, finance };
}

export default connect(mapStateToProps)(AccountingRapports);
