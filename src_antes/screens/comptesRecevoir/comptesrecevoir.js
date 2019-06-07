import React, { PureComponent } from "react";
import { Button, Icon, Grid, Input, Header } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import DebtTable from "../../components/debt-table/debttable";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";
import { getDebtsClientByRange } from "../../redux/actions/debt";

//Styles
import styles from "./comptesrecevoir.module.css";

const date = new Date();
const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];

class ComptesRecevoir extends PureComponent {
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

	handleSearch = e => {
		e.preventDefault();
		this.props.dispatch(getDebtsClientByRange(this.state.startDate, this.state.endDate));
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		if (name === "startDate" && value <= this.state.endDate) return this.setState({ [name]: value });
		if (name === "endDate" && value >= this.state.startDate) return this.setState({ [name]: value });
	};

	render() {
		return (
			<CustomMenu screenName="Comptes a Recevoir">
				<div>
					<Grid>
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
						<Grid.Row>
							<Grid.Column>
								<DebtTable type={"recevoir"} />
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</div>
			</CustomMenu>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(ComptesRecevoir);
