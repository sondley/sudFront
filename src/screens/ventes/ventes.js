import React, { PureComponent } from "react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import CommandeTable from "../../components/commande-table/commandetable";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

class Ventes extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			toRegister: false
		};
		if (this.props.navigation.navigate) {
			this.props.dispatch(endNavigation());
		}
		this.props.dispatch(getPageIndexByRoute(window.location.pathname));
	}

	handleNavigate = e => {
		e.preventDefault();
		this.setState({ toRegister: true });
	};

	render() {
		return (
			<CustomMenu screenName="Ventes">
				<div>
					<CommandeTable proxy />
				</div>
			</CustomMenu>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(Ventes);
