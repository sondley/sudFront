import React, { PureComponent } from "react";
import { Grid, Button, Modal } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import BNRReport from "../../components/BNRRapport/bnrrapport";
import BalanceReport from "../../components/BalanceRapport/balancerapport";
import ResultatReport from "../../components/ResultatRapport/resultatrapport";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

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
			<React.Fragment>
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
			</React.Fragment>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(AccountingRapports);
