import React, { PureComponent } from "react";
import { Dimmer } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import ValidateCommandeTable from "../../components/validate-commande-table/validatecommandetable";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

class ValidateCommande extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
		if (this.props.navigation.navigate) {
			this.props.dispatch(endNavigation());
		}
		this.props.dispatch(getPageIndexByRoute(window.location.pathname));
	}

	render() {
		return (
			<Dimmer.Dimmable blurring dimmed={this.state.modalIsOpen}>
				<CustomMenu screenName="Valider Commande">
					<ValidateCommandeTable />
				</CustomMenu>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(ValidateCommande);
