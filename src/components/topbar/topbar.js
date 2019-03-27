import React, { PureComponent } from "react";
import { Label, Icon, Dropdown, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import "./topbar.css";
import { logout } from "../../redux/actions/user";

class TopBar extends PureComponent {
	handleClick = e => {
		e.preventDefault();
		this.props.dispatch(logout());
	};

	render() {
		const { screenName, toggleMenu } = this.props;
		const { nom, prenom } = this.props.user.authedUser;
		const username = window.innerWidth < 600 ? nom : prenom + " " + nom;

		const perfil = [
			{
				key: 1,
				icon: "sign-out",
				text: "Log Out",
				value: 2,
				onClick: this.handleClick,
				style: { fontSize: "20px" }
			}
		];

		if (window.innerWidth <= 550) {
			return (
				<div className="topbar-container">
					<div className="topbar-menu-button-label">
						<Button
							circular
							icon="bars"
							size="small"
							color="black"
							onClick={toggleMenu}
							className="menu-button-margin"
						/>
					</div>
					<div className="topbar-profile-notification-container">
						<div style={{ fontSize: "20px" }}>
							<Icon name="user" />
							<Dropdown text={username} options={perfil} pointing="top right" />
						</div>
					</div>
				</div>
			);
		} else if (window.innerWidth <= 768 && window.innerWidth > 550) {
			return (
				<div className="topbar-container">
					<div className="topbar-menu-button-label">
						<Button
							circular
							icon="bars"
							size="small"
							color="black"
							onClick={toggleMenu}
							className="menu-button-margin"
						/>
						<Label tag color="black" size="large">
							{screenName}
						</Label>
					</div>
					<div className="topbar-profile-notification-container">
						<div style={{ fontSize: "20px" }}>
							<Icon name="user" />
							<Dropdown text={username} options={perfil} pointing="top right" />
						</div>
					</div>
				</div>
			);
		}
		return (
			<div className="topbar-container">
				<div className="topbar-menu-button-label">
					<Label tag color="black" size="large">
						{screenName}
					</Label>
				</div>
				<div className="topbar-profile-notification-container">
					<div style={{ fontSize: "20px" }}>
						<Icon name="user" />
						<Dropdown text={username} options={perfil} pointing="top right" />
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ user }) {
	return { user };
}

export default connect(mapStateToProps)(TopBar);
