import React, { PureComponent } from "react";
import { Button, Icon, Grid, Dimmer, Modal } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import ProviderTable from "../../components/provider-table/providertable";
import ProviderForm from "../../components/provider-form/providerform";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

//Styles
import styles from "./fournisseurs.module.css";

class Fournisseurs extends PureComponent {
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
					<ProviderForm onClose={this.handleCloseModal} />
				</Modal>
				<CustomMenu screenName="Fournisseurs">
					<div>
						<Grid className={styles.noMarginBottom}>
							<Grid.Row>
								<Grid.Column floated="right" className={styles.rightAligned}>
									<Button icon labelPosition="left" positive size="small" onClick={this.handleAdd}>
										<Icon name="add" /> Ajouter un Fournisseur
									</Button>
								</Grid.Column>
							</Grid.Row>
						</Grid>
						<ProviderTable />
					</div>
				</CustomMenu>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(Fournisseurs);
