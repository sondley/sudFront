import React, { PureComponent } from "react";
import { isArray } from "lodash";
import { connect } from "react-redux";
import { Header, Sidebar } from "semantic-ui-react";

//Internal Components
import SidebarMenu from "../../components/sidebar-menu/sidebar-menu";
import TopBar from "../../components/topbar/topbar";

//Styles
import "./custom-menu.css";

class CustomMenu extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			dimmed: true,
			visible: true
		};
		this.wrapperRef = React.createRef();
	}

	componentDidMount = () => {
		if (window.innerWidth <= 768) {
			this.setState({ dimmed: false, visible: false });
		} else {
			this.setState({ dimmed: false });
		}
		document.addEventListener("mousedown", this.handleClickOutside);
	};

	setWrapperRef = node => {
		this.wrapperRef = node;
	};

	handleClickOutside = event => {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			if (window.innerWidth <= 768) {
				this.setState({ dimmed: false, visible: false });
			}
		}
	};

	handleShowHideClick = e => {
		e.preventDefault();
		e.stopPropagation();
		if (window.innerWidth <= 768) {
			return this.setState(prevState => ({ dimmed: !prevState.dimmed, visible: !prevState.visible }));
		}
		this.setState(prevState => ({ visible: !prevState.visible }));
	};

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
		const classNeim = this.state.visible && window.innerWidth > 768 ? "paddingPusher" : "";
		const menuOptions = this.props.navigation.navTree;
		return (
			<div className="custom-menu-container">
				<Sidebar.Pushable className="fullWidth">
					<Sidebar
						className="responsive-sidebar"
						animation={window.innerWidth <= 768 ? "overlay" : "slide along"}
						visible={this.state.visible}
					>
						<div ref={this.setWrapperRef} className="sidebar-box">
							<SidebarMenu data={menuOptions} />
						</div>
					</Sidebar>
					<Sidebar.Pusher dimmed={this.state.dimmed} className={classNeim}>
						<div className="right-box">
							<TopBar screenName={screenName} toggleMenu={this.handleShowHideClick} />
							<div className="fixedContainer">
								<Header className="fixedTitle" textAlign="center" as="h1">
									{screenName}
								</Header>
							</div>
							<div className="custom-menu-sidebar">{this.renderChildren(children)}</div>
						</div>
					</Sidebar.Pusher>
				</Sidebar.Pushable>
			</div>
		);
	}
}

function mapStateToProps({ user, navigation }) {
	return { user, navigation };
}

export default connect(mapStateToProps)(CustomMenu);
