import React, { PureComponent } from "react";
import { Button, Icon, Grid, Dimmer, Modal, Message } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import CommandeTable from "../../components/commande-table/commandetable";
import CommandeForm from "../../components/commande-form/commandeform";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

//Styles
import styles from "./commande.module.css";

class Commande extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			modalIsOpen: false,
			errorModal: false
		};
		if (this.props.navigation.navigate) {
			this.props.dispatch(endNavigation());
		}
		this.props.dispatch(getPageIndexByRoute(window.location.pathname));
	}

	handleAdd = e => {
		e.preventDefault();
		if (this.props.compte.caisse.etat !== "0") {
			return this.setState({ modalIsOpen: true });
		}
		return this.setState({ errorModal: true });
	};

	handleCloseModal = () => {
		this.setState({ modalIsOpen: false });
	};

	handleCloseErrorModal = () => {
		this.setState({ errorModal: false });
	};

	render() {
		return (
			<Dimmer.Dimmable blurring dimmed={this.state.modalIsOpen}>
				<Modal open={this.state.modalIsOpen} onClose={this.handleCloseModal}>
					<CommandeForm onClose={this.handleCloseModal} />
				</Modal>
				<Modal open={this.state.errorModal} onClose={this.handleCloseErrorModal} className={styles.dimmerMargin}>
					<Message className={styles.dimmerMargin} error>
						<Message.Item className={styles.noStyleList}>
							<Icon name="warning sign" size="huge" />
						</Message.Item>
						<Message.List
							items={[
								"Desolé, aucun transaction ne peut etre realiser en ce moment.Veillez attendre la Ouverture du caisse."
							]}
							className={styles.paddingBottom}
						/>
					</Message>
				</Modal>
				<CustomMenu screenName="Commande">
					<div>
						<Grid className={styles.noMarginBottom}>
							<Grid.Row>
								<Grid.Column floated="right" className={styles.rightAligned}>
									<Button icon labelPosition="left" positive size="small" onClick={this.handleAdd}>
										<Icon name="add" /> Ajouter un Commande
									</Button>
								</Grid.Column>
							</Grid.Row>
						</Grid>
						<CommandeTable />
					</div>
				</CustomMenu>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ navigation, compte }) {
	return { navigation, compte };
}

export default connect(mapStateToProps)(Commande);
