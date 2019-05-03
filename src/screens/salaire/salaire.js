import React, { PureComponent } from "react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import SalaireTable from "../../components/salaire-table/salairetable";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

class Salaire extends PureComponent {
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

	render() {
		return (
			<CustomMenu screenName="Augmenter le Salaire">
				<SalaireTable />
			</CustomMenu>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(Salaire);
