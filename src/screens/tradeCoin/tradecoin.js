import React, { PureComponent } from "react";
import { Button, Icon, Grid, Dimmer, Modal, Header, Input, Message } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import CoinTradeTable from "../../components/cointrade-table/cointradetable";
import CoinTradeForm from "../../components/cointrade-form/cointradeform";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";
import { getCoinTradesByRange } from "../../redux/actions/cointrades";

//Styles
import styles from "./tradecoin.module.css";

const date = new Date();
const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];

class TradeCoin extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			modalIsOpen: false,
			errorModal: false,
			type: "",
			startDate: dateString,
			endDate: dateString
		};
		if (this.props.navigation.navigate) {
			this.props.dispatch(endNavigation());
		}
		this.props.dispatch(getPageIndexByRoute(window.location.pathname));
	}

	handleAddVendre = e => {
		e.preventDefault();
		if (this.props.compte.caisse.etat !== "0") {
			return this.setState({ modalIsOpen: true, type: "vendre" });
		}
		return this.setState({ errorModal: true });
	};

	handleAddAcheter = e => {
		e.preventDefault();
		if (this.props.compte.caisse.etat !== "0") {
			return this.setState({ modalIsOpen: true, type: "acheter" });
		}
		return this.setState({ errorModal: true });
	};

	handleCloseModal = () => {
		this.setState({ modalIsOpen: false });
	};

	handleSearch = e => {
		e.preventDefault();
		this.props.dispatch(getCoinTradesByRange(this.state.startDate, this.state.endDate));
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		if (name === "startDate" && value <= this.state.endDate) return this.setState({ [name]: value });
		if (name === "endDate" && value >= this.state.startDate) return this.setState({ [name]: value });
	};

	handleCloseErrorModal = () => {
		this.setState({ errorModal: false });
	};

	render() {
		return (
			<Dimmer.Dimmable blurring dimmed={this.state.modalIsOpen}>
				<Modal open={this.state.modalIsOpen} onClose={this.handleCloseModal}>
					<CoinTradeForm type={this.state.type} onClose={this.handleCloseModal} />
				</Modal>
				<Modal open={this.state.errorModal} onClose={this.handleCloseErrorModal} className={styles.dimmerMargin}>
					<Message className={styles.dimmerMargin} error>
						<Message.Item className={styles.noStyleList}>
							<Icon name="warning sign" size="huge" />
						</Message.Item>
						<Message.List
							items={[
								"Desolé, aucun transaction ne peut etre realiser en ce moment.Veillez attendre la Ouverture du caisse."
							]}
							className={styles.paddingBottom}
						/>
					</Message>
				</Modal>
				<CustomMenu screenName="Changemente Monnaie">
					<div>
						<Grid className={styles.noMarginBottom}>
							<Grid.Row>
								<Grid.Column width={16} floated="right" className={styles.rightAligned}>
									<div className={styles.buttonSpacing}>
										<Button icon labelPosition="left" color="brown" size="small" onClick={this.handleAddAcheter}>
											<Icon name="sign-in" /> Acheter de la monnaie au client
										</Button>
										<Button icon labelPosition="left" color="green" size="small" onClick={this.handleAddVendre}>
											<Icon name="sign-out" /> Vendre de la monnaie au client
										</Button>
									</div>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row centered>
								<Grid.Column width={16} className={styles.centered}>
									<Header as="h2" content="Recherche avec la Date" />
								</Grid.Column>
							</Grid.Row>
							<Grid.Row centered>
								<Grid.Column width={16} className={styles.centered}>
									<div className={styles.timeRange}>
										<Input
											className={styles.spacing}
											type="date"
											label="De"
											labelPosition="left"
											size="small"
											name="startDate"
											onChange={this.handleInputOnChange}
											value={this.state.startDate}
										/>
										<Input
											className={styles.spacing}
											type="date"
											label="À"
											labelPosition="left"
											size="small"
											name="endDate"
											onChange={this.handleInputOnChange}
											value={this.state.endDate}
										/>
										<Button
											className={styles.matchPadding}
											icon
											labelPosition="left"
											color="blue"
											size="small"
											onClick={this.handleSearch}
										>
											<Icon name="search" /> Rechercher
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

function mapStateToProps({ navigation, compte }) {
	return { navigation, compte };
}

export default connect(mapStateToProps)(TradeCoin);
