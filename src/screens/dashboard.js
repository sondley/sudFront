import React, { PureComponent } from "react";

//Components
import CustomMenu from "../components/custom-menu/custom-menu";

class Dashboard extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			toRegister: false
		};
	}

	handleNavigate = e => {
		e.preventDefault();
		this.setState({ toRegister: true });
	};

	render() {
		return (
			<CustomMenu>
				<div className="prueba-de-contenido">
					<h3>Bienvenue Marche Grand Sud</h3>
				</div>
			</CustomMenu>
		);
	}
}

export default Dashboard;
