import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Message, Dimmer, Icon, Card, Table } from "semantic-ui-react";
import { getOrderByNumber, createDevolution, modifyDevolution } from "../../redux/actions/devolution";
import { isEmpty, find } from "lodash";

//Styles
import styles from "./devolutionform.module.css";

class DevolutionForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			edit: false || this.props.edit,
			view: false || this.props.view,
			headerErrorMessage: "",
			contentErrorMessage: "vous devez retourner au moins un produit",
			numero: "",
			client: "",
			orderList: [],
			devolutionList: [],
			quantiteList: [],
			formError: false,
			isModalOpen: false,
			isRenderable: false
		};
	}

	componentDidMount = async () => {
		if (this.state.edit || this.state.view) {
			await this.props.dispatch(getOrderByNumber(this.props.data.numero));
			const quantiteList = this.props.data.arrayOrden.map(item => {
				return item.quantite;
			});
			this.setState({
				numero: this.props.data.numero,
				client: this.props.data.client,
				isRenderable: true,
				orderList: this.props.devolution.printOrder.arrayOrden,
				devolutionList: this.props.data.arrayOrden,
				quantiteList
			});
		}
	};

	handleSearchOrder = async e => {
		e.preventDefault();
		await this.props.dispatch(getOrderByNumber(this.state.numero));
		const orderList = this.props.devolution.printOrder.arrayOrden;
		const quantiteList = orderList.map(() => {
			return 0;
		});
		this.setState({
			isRenderable: true,
			orderList,
			devolutionList: orderList,
			quantiteList,
			client: this.props.devolution.printOrder.client
		});
	};

	handleChange = event => {
		event.preventDefault();
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	handleModalClose = () => {
		this.setState({ isModalOpen: false });
	};

	handleSubmit = event => {
		event.preventDefault();
		const { devolutionList, quantiteList } = this.state;
		if (
			find(quantiteList, x => {
				return x !== 0;
			})
		) {
			if (this.state.edit) {
				const devolution = {
					...this.props.data,
					idRealisateur: this.props.user.authedUser._id,
					arrayOrden: devolutionList.map((item, index) => {
						return { idproduit: item.idproduit, prixUnite: item.prixUnite, quantite: quantiteList[index] };
					})
				};
				return this.props.dispatch(modifyDevolution(devolution, this.props.onClose));
			}
			const devolution = {
				numero: this.state.numero,
				idRealisateur: this.props.user.authedUser._id,
				client: this.state.client,
				arrayOrden: devolutionList.map((item, index) => {
					return { idproduit: item.idproduit, prixUnite: item.prixUnite, quantite: quantiteList[index] };
				})
			};
			this.props.dispatch(createDevolution(devolution, this.props.onClose));
		} else {
			this.setState({ isModalOpen: true });
		}
	};

	handleSubstract = (e, value, index) => {
		e.preventDefault();
		let newList = [...this.state.quantiteList];
		if (newList[index] > 0) {
			newList[index] = value - 1;
			this.setState({ quantiteList: newList });
		}
	};

	handleAdd = (e, value, index) => {
		e.preventDefault();
		let newList = [...this.state.quantiteList];
		if (newList[index] < this.state.orderList[index].quantite) {
			newList[index] = value + 1;
			this.setState({ quantiteList: newList });
		}
	};

	renderOrderTableRows = data => {
		if (!isEmpty(data)) {
			let rows;
			rows = data.map(item => {
				return (
					<Table.Row key={item._id}>
						<Table.Cell>{item.nom}</Table.Cell>
						<Table.Cell>{item.prixUnite}</Table.Cell>
						<Table.Cell>{item.quantite}</Table.Cell>
						<Table.Cell>{item.total}</Table.Cell>
					</Table.Row>
				);
			});
			return rows;
		}
		return;
	};

	renderDevolutionTableRows = data => {
		if (!isEmpty(data)) {
			let rows;
			if (this.state.view) {
				rows = data.map(item => {
					return (
						<Table.Row key={item._id}>
							<Table.Cell>{item.nom}</Table.Cell>
							<Table.Cell>{item.prixUnite}</Table.Cell>
							<Table.Cell>{item.quantite}</Table.Cell>
						</Table.Row>
					);
				});
			} else {
				rows = data.map((item, index) => {
					return (
						<Table.Row key={item._id}>
							<Table.Cell>{item.nom}</Table.Cell>
							<Table.Cell>{item.prixUnite}</Table.Cell>
							<Table.Cell>{this.state.quantiteList[index]}</Table.Cell>
							<Table.Cell collapsing>
								<div className={styles.cellSpacing}>
									<Button
										icon="minus square"
										color="red"
										onClick={e => {
											this.handleSubstract(e, this.state.quantiteList[index], index);
										}}
									/>
									<Button
										icon="plus square"
										color="green"
										onClick={e => {
											this.handleAdd(e, this.state.quantiteList[index], index);
										}}
									/>
								</div>
							</Table.Cell>
						</Table.Row>
					);
				});
			}
			return rows;
		}
		return;
	};

	render() {
		let title = "Entrain de Ajouter une Devolution";
		let label = "Ajouter";
		if (this.state.edit) {
			title = "Entrain de Modifier le Devolution";
			label = "Modifier";
		} else if (this.state.view) {
			title = "Entrain de Voir le Devolution";
		}

		return (
			<Dimmer.Dimmable dimmed={this.state.isModalOpen}>
				<Dimmer active={this.state.isModalOpen} page onClickOutside={this.handleModalClose}>
					<Message className={styles.dimmerMargin} negative>
						<Message.Item className={styles.noStyleList}>
							<Icon name="warning sign" size="huge" />
						</Message.Item>
						<Message.Header>{this.state.headerErrorMessage}</Message.Header>
						<Message.Content>{this.state.contentErrorMessage}</Message.Content>
					</Message>
				</Dimmer>
				<Card fluid centered className={styles.boxContainerWide}>
					<Card.Content>
						<Card.Header className="font font-18" textAlign="center">
							{title}
						</Card.Header>
						<div className={styles.basicFormContainer}>
							<Form className={styles.basicFormWidth}>
								<Form.Group grouped>
									<Form.Field style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
										<label className={styles.basicFormSpacing}>Numéro de Commande</label>
										<div style={{ display: "flex" }}>
											<Input
												style={{ flex: 3, paddingRight: "10px" }}
												disabled={this.state.view}
												icon="hashtag"
												iconPosition="left"
												placeholder="Numéro de Commande"
												name="numero"
												value={this.state.numero}
												onChange={this.handleChange}
											/>
											<Button
												style={{ flex: 1 }}
												icon="search"
												color="teal"
												onClick={this.handleSearchOrder}
												content="Rechercher"
												disabled={this.state.view}
											/>
										</div>
									</Form.Field>
									<div style={this.state.isRenderable ? { display: "block" } : { display: "none" }}>
										<label className={styles.basicTitleSpacing}>Produits du Commande #{this.state.numero}</label>
										<div className={styles.basicFormSpacing}>
											<Table selectable compact celled striped size="small">
												<Table.Header>
													<Table.Row>
														<Table.HeaderCell>Produit</Table.HeaderCell>
														<Table.HeaderCell>Prix per Unite</Table.HeaderCell>
														<Table.HeaderCell>Quantite</Table.HeaderCell>
														<Table.HeaderCell>Total</Table.HeaderCell>
													</Table.Row>
												</Table.Header>
												<Table.Body>{this.renderOrderTableRows(this.state.orderList)}</Table.Body>
											</Table>
										</div>
										<label className={styles.basicTitleSpacing}>Produits à Retourner</label>
										<div className={styles.basicFormSpacing}>
											<Table selectable compact celled striped size="small">
												<Table.Header>
													<Table.Row>
														<Table.HeaderCell>Produit</Table.HeaderCell>
														<Table.HeaderCell>Prix per Unite</Table.HeaderCell>
														<Table.HeaderCell>Quantite</Table.HeaderCell>
														<Table.HeaderCell style={this.state.view ? { display: "none" } : { display: "block" }}>
															Actions
														</Table.HeaderCell>
													</Table.Row>
												</Table.Header>
												<Table.Body>{this.renderDevolutionTableRows(this.state.devolutionList)}</Table.Body>
											</Table>
										</div>
									</div>
									<div style={this.state.view || !this.state.isRenderable ? { display: "none" } : { display: "block" }}>
										<Button fluid size="small" color="teal" content={label} onClick={this.handleSubmit} />
									</div>
								</Form.Group>
							</Form>
						</div>
					</Card.Content>
				</Card>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ devolution, user }) {
	return { devolution, user };
}

export default connect(mapStateToProps)(DevolutionForm);
