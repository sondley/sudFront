import React, { PureComponent } from "react";
import { Dimmer, Modal } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import ProduitTable from "../../components/produit-table/produittable";
import ProduitForm from "../../components/produit-form/produitform";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

class Produits extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			modalIsOpen: false
		};
		if (this.props.navigation.navigate) {
			this.props.dispatch(endNavigation());
		}
		this.props.dispatch(getPageIndexByRoute(window.location.pathname));
	}

	handleAdd = e => {
		e.preventDefault();
		this.setState({ modalIsOpen: true });
	};

	handleCloseModal = () => {
		this.setState({ modalIsOpen: false });
	};

	render() {
		return (
			<Dimmer.Dimmable blurring dimmed={this.state.modalIsOpen}>
				<Modal open={this.state.modalIsOpen} onClose={this.handleCloseModal}>
					<ProduitForm onClose={this.handleCloseModal} />
				</Modal>
				<CustomMenu screenName="Produits">
					<ProduitTable />
				</CustomMenu>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(Produits);
