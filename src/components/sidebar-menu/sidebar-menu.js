import React, { PureComponent } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Accordion, Menu, Divider } from "semantic-ui-react";

//Internal Components
import SidebarLogo from "../../components/sidebar-logo/sidebar-logo";
import SidebarItem from "../../components/sidebar-item/sidebar-item";

//Styles
import "./sidebar-menu.css";

//Logic
import { menuNavigation } from "../../redux/actions/navigate";

class SidebarMenu extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			navigate: false,
			activeIndex: this.props.navigation.index
		};
	}

	handleItemClick = (e, titleProps) => {
		const { index, name } = titleProps;
		const { activeIndex } = this.state;

		if (activeIndex !== index) {
			this.props.dispatch(menuNavigation(name));
		}
		return this.setState({ activeIndex: index });
	};

	renderMenuItems = data => {
		const items = data.map((item, index) => {
			const active = this.state.activeIndex === item.index ? true : false;
			const activeClass = active ? "sidebar-menu-item-active" : "sidebar-menu-item";
			return (
				<SidebarItem
					key={index}
					name={item.name}
					icon={item.icon}
					label={item.label}
					index={item.index}
					activeClass={activeClass}
					onClick={this.handleItemClick}
					active={active}
				/>
			);
		});

		return items;
	};

	render() {
		const { data } = this.props;

		if (this.props.navigation.navigate === true && window.location.pathname !== this.props.navigation.route) {
			return <Redirect push to={this.props.navigation.route} />;
		}

		return (
			<div className="homepage-logo-container">
				<div className="homepage-blackcover">
					<div className="home-text-center">
						<SidebarLogo imgUrl={process.env.PUBLIC_URL + "/logo.svg"} width={"180px"} />
					</div>
					<Divider className="home-divider-color" />
					<div className="home-sidebarmenu-container">
						<Accordion className="sidebar-menu-item-container" as={Menu} vertical inverted>
							{this.renderMenuItems(data)}
						</Accordion>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(SidebarMenu);
