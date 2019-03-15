import React, { PureComponent } from "react";
import { Button, Icon, Grid, Dimmer, Modal } from "semantic-ui-react";
import { connect } from "react-redux";

//Components
import CustomMenu from "../../components/custom-menu/custom-menu";
import TauxTable from "../../components/taux-table/tauxtable";
import TauxForm from "../../components/taux-form/tauxform";

//Logic
import { endNavigation, getPageIndexByRoute } from "../../redux/actions/navigate";

//Styles
import styles from "./tauxdechange.module.css";

class TauxDeChange extends PureComponent {
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
					<TauxForm onClose={this.handleCloseModal} />
				</Modal>
				<CustomMenu screenName="Taux de Change">
					<div>
						<Grid className={styles.noMarginBottom}>
							<Grid.Row>
								<Grid.Column floated="right" className={styles.rightAligned}>
									<Button icon labelPosition="left" positive size="small" onClick={this.handleAdd}>
										<Icon name="add" /> Ajouter Monnaie
									</Button>
								</Grid.Column>
							</Grid.Row>
						</Grid>
						<TauxTable />
					</div>
				</CustomMenu>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ navigation }) {
	return { navigation };
}

export default connect(mapStateToProps)(TauxDeChange);
