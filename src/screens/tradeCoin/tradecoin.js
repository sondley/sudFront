import React, { PureComponent } from "react";
import { Button, Icon, Grid, Dimmer, Modal } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import CoinTradeTable from "../../components/cointrade-table/cointradetable";
import CoinTradeForm from "../../components/cointrade-form/cointradeform";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

//Styles
import styles from "./tradecoin.module.css";

class TauxDeChange extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			modalIsOpen: false,
			type: ""
		};
		if (this.props.navigation.navigate) {
			this.props.dispatch(endNavigation());
		}
		this.props.dispatch(getPageIndexByRoute(window.location.pathname));
	}

	handleAddVendre = e => {
		e.preventDefault();
		this.setState({ modalIsOpen: true, type: "vendre" });
	};

	handleAddAcheter = e => {
		e.preventDefault();
		this.setState({ modalIsOpen: true, type: "acheter" });
	};

	handleCloseModal = () => {
		this.setState({ modalIsOpen: false });
	};

	render() {
		return (
			<Dimmer.Dimmable blurring dimmed={this.state.modalIsOpen}>
				<Modal open={this.state.modalIsOpen} onClose={this.handleCloseModal}>
					<CoinTradeForm type={this.state.type} onClose={this.handleCloseModal} />
				</Modal>
				<CustomMenu screenName="Monnaie">
					<div>
						<Grid className={styles.noMarginBottom}>
							<Grid.Row>
								<Grid.Column width={7} floated="right" className={styles.rightAligned}>
									<div className={styles.buttonSpacing}>
										<Button icon labelPosition="left" color="brown" size="small" onClick={this.handleAddAcheter}>
											<Icon name="sign-in" /> Acheter Monnaie
										</Button>
										<Button icon labelPosition="left" color="green" size="small" onClick={this.handleAddVendre}>
											<Icon name="sign-out" /> Vendre Monnaie
										</Button>
									</div>
								</Grid.Column>
							</Grid.Row>
						</Grid>
						<CoinTradeTable />
					</div>
				</CustomMenu>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(TauxDeChange);
