import React, { PureComponent } from "react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import ValidateCoinTradeTable from "../../components/validate-cointrade-table/validatecointradetable";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

class ValidateTradeCoin extends PureComponent {
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
			<CustomMenu screenName="Validate Changement Monnaie">
				<ValidateCoinTradeTable />
			</CustomMenu>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(ValidateTradeCoin);
