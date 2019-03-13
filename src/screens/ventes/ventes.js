import React, { PureComponent } from "react";
import { Button, Icon, Grid, Dimmer, Modal } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import CommandeTable from "../../components/commande-table/commandetable";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

class Ventes extends PureComponent {
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

	handleNavigate = e => {
		e.preventDefault();
		this.setState({ toRegister: true });
	};

	render() {
		return (
			<Dimmer.Dimmable blurring dimmed={this.state.modalIsOpen}>
				{/* <Modal open={this.state.modalIsOpen} onClose={this.handleCloseModal}>
					<CommandeForm onClose={this.handleCloseModal} />
				</Modal> */}
				<CustomMenu screenName="Ventes">
					<div>
						{/* <Grid className={styles.noMarginBottom}>
							<Grid.Row>
								<Grid.Column floated="right" className={styles.rightAligned}>
									<Button icon labelPosition="left" positive size="small" onClick={this.handleAdd}>
										<Icon name="add" /> Ajouter un Commande
									</Button>
								</Grid.Column>
							</Grid.Row>
						</Grid> */}
						<CommandeTable proxy />
					</div>
				</CustomMenu>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(Ventes);
