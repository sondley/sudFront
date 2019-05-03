import React, { PureComponent } from "react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import SollicitudeTable from "../../components/sollicitude-table/sollicitudetable";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

class ValidateSolicitude extends PureComponent {
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
			<CustomMenu screenName="Sollicitude">
				<SollicitudeTable />
			</CustomMenu>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(ValidateSolicitude);
