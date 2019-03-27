import React, { PureComponent } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import CompteTable from "../../components/compte-table/comptetable";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

//Styles
import styles from "./voirTransactions.module.css";

class VoirTransactions extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
		if (this.props.navigation.navigate) {
			this.props.dispatch(endNavigation());
		}
		this.props.dispatch(getPageIndexByRoute(window.location.pathname));
	}

	render() {
		const { moneyCompte } = this.props.compte;

		return (
			<CustomMenu screenName="Voir Transactions">
				<div>
					<Grid className={styles.noMarginBottom}>
						<Grid.Row>
							<Grid.Column textAlign="center">
								<label className={styles.moneyTitle}>Argent Disponible: ${moneyCompte}.00 HTG</label>
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
		);
	}
}

function mapStateToProps({ navigation, compte }) {
	return { navigation, compte };
}

export default connect(mapStateToProps)(VoirTransactions);
