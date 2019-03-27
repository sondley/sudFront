import React, { PureComponent } from "react";
import { Button, Icon, Grid, Dimmer, Modal, Input, Header } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import BuyTable from "../../components/buy-table/buytable";
import BuyForm from "../../components/buy-form/buyform";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";
import { getBuysByRange } from "../../redux/actions/buys";

//Styles
import styles from "./achats.module.css";

const date = new Date();
const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];

class Achats extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			startDate: dateString,
			endDate: dateString
		};

		if (this.props.navigation.navigate) {
			this.props.dispatch(endNavigation());
		}
		this.props.dispatch(getPageIndexByRoute(window.location.pathname));
	}

	handleAdd = e => {
		e.preventDefault();
		this.setState({ modalIsOpen: true });
	};

	handleSearch = e => {
		e.preventDefault();
		this.props.dispatch(getBuysByRange(this.state.startDate, this.state.endDate));
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		if (name === "startDate" && value <= this.state.endDate) return this.setState({ [name]: value });
		if (name === "endDate" && value >= this.state.startDate) return this.setState({ [name]: value });
	};

	handleCloseModal = () => {
		this.setState({ modalIsOpen: false });
	};

	render() {
		return (
			<Dimmer.Dimmable blurring dimmed={this.state.modalIsOpen}>
				<Modal open={this.state.modalIsOpen} onClose={this.handleCloseModal}>
					<BuyForm onClose={this.handleCloseModal} />
				</Modal>
				<CustomMenu screenName="Achat">
					<div>
						<Grid className={styles.noMarginBottom}>
							<Grid.Row>
								<Grid.Column floated="right" className={styles.rightAligned}>
									<Button icon labelPosition="left" positive size="small" onClick={this.handleAdd}>
										<Icon name="add" /> Faire un Achat
									</Button>
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
						<BuyTable />
					</div>
				</CustomMenu>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(Achats);
