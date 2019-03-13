import React, { PureComponent } from "react";
import { isArray } from "lodash";
import { connect } from "react-redux";

//Internal Components
import SidebarMenu from "../../components/sidebar-menu/sidebar-menu";
import TopBar from "../../components/topbar/topbar";

//Styles
import "./custom-menu.css";

class CustomMenu extends PureComponent {
	renderChildren = children => {
		if (isArray(children)) {
			const items = children.map((child, index) => {
				return (
					<div className="contentContainer" key={index}>
						{child}
					</div>
				);
			});
			return items;
		} else {
			return <div className="contentContainer">{children}</div>;
		}
	};

	render() {
		const { children, screenName } = this.props;
		const menuOptions = this.props.navigation.navTree;
		return (
			<div className="custom-menu-container">
				<div className="sidebar-box">
					<SidebarMenu data={menuOptions} />
				</div>
				<div className="right-box">
					<TopBar screenName={screenName} />
					<div className="custom-menu-sidebar">{this.renderChildren(children)}</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ user, navigation }) {
	return { user, navigation };
}

export default connect(mapStateToProps)(CustomMenu);
