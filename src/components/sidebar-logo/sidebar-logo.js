import React, { PureComponent } from "react";
import Logo from "../../assets/ThuRealLogo.png";

class sidebarLogo extends PureComponent {
	render() {
		return (
			<div>
				<img className="responsive-img" src={Logo} alt="hey" width={"180px"} />
			</div>
		);
	}
}

export default sidebarLogo;
