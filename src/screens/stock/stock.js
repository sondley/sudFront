import React, { PureComponent } from "react";
import { Button, Icon, Grid, Dimmer, Modal } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import ProduitTable from "../../components/produit-table/produittable";
import ProduitForm from "../../components/produit-form/produitform";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

//Styles
import styles from "./stock.module.css";

class Stock extends PureComponent {
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
					<div>
						<Grid className={styles.noMarginBottom}>
							<Grid.Row>
								<Grid.Column floated="right" className={styles.rightAligned}>
									<Button icon labelPosition="left" positive size="small" onClick={this.handleAdd}>
										<Icon name="add" /> Ajouter un Produit
									</Button>
								</Grid.Column>
							</Grid.Row>
						</Grid>
						<ProduitTable />
					</div>
				</CustomMenu>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(Stock);
