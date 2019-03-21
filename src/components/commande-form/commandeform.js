import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Message, Dimmer, Icon, Card, Search, Table, Modal } from "semantic-ui-react";
import { createOrder, modifyOrder } from "../../redux/actions/order";
import { getProducts } from "../../redux/actions/product";
import { escapeRegExp, filter, debounce, isEmpty, slice, find } from "lodash";

//
import CommandeProduitForm from "../commande-product-form/commandeproductform";

//Styles
import styles from "./commandeform.module.css";

class CommandeForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			edit: false || this.props.edit,
			view: false || this.props.view,
			headerErrorMessage: "",
			clientName: "",
			total: 0,
			products: "",
			productList: [],
			productModalType: "new",
			clientNameError: false,
			formError: false,
			isModalOpen: false,
			isProductModalOpen: false,
			results: [],
			item: {},
			isLoading: false
		};
		if (!this.state.view) {
			this.props.dispatch(getProducts());
		}
	}

	componentDidMount = () => {
		if (this.state.edit || this.state.view) {
			this.setState({
				clientName: this.props.data.client,
				total: this.props.data.totalFinal,
				productList: this.props.data.arrayOrden
			});
		}
	};

	handleChange = event => {
		event.preventDefault();
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	handleModalClose = () => {
		this.setState({ isModalOpen: false, isProductModalOpen: false });
	};

	addToList = (id, name, priceUnit, quantity) => {
		const newProduct = {
			idproduit: id,
			nom: name,
			prixUnite: priceUnit,
			quantite: quantity,
			total: parseInt(priceUnit) * parseInt(quantity)
		};
		const newList = this.state.productList.concat(newProduct);
		this.setState({ productList: newList });
	};

	reduceToList = (id, quantity) => {
		let repeatedItem = find(this.state.productList, { idproduit: id });
		const newProduct = {
			...repeatedItem,
			quantite: quantity + repeatedItem.quantite,
			total: parseInt(repeatedItem.prixUnite) * parseInt(quantity + repeatedItem.quantite)
		};
		const newList = this.state.productList.map(item => {
			if (item.idproduit !== newProduct.idproduit) {
				return item;
			}
			return { ...item, ...newProduct };
		});
		this.setState({ productList: newList });
	};

	resetComponent = name => this.setState({ isLoading: false, results: [], [name]: "" });

	handleResultSelect = (e, data) => {
		const getProduct = id => filter(this.props.product.products, { _id: id });
		const item = getProduct(data.result.id);
		let repeatedItem = find(this.state.productList, { idproduit: item[0]._id });
		if (repeatedItem) {
			return this.setState({
				results: [],
				product: "",
				isProductModalOpen: true,
				item: item[0],
				productModalType: "repeat"
			});
		} else {
			return this.setState({
				results: [],
				product: "",
				isProductModalOpen: true,
				item: item[0],
				productModalType: "new"
			});
		}
	};

	handleSearchChange = (e, { value, name }) => {
		this.setState({ [name]: value, isLoading: true });

		setTimeout(() => {
			if (this.state[name].length < 1) return this.resetComponent(name);
			let source = this.props.product.products.map(item => {
				return { id: item._id, title: item.nom };
			});
			let trimmedString = new RegExp(escapeRegExp(this.state[name]), "i");
			const isMatch = result => trimmedString.test(result.title);
			const matchedResults = filter(source, isMatch);
			const limitedResults = slice(matchedResults, 0, 5);
			return this.setState({
				isLoading: false,
				results: limitedResults
			});
		}, 500);
	};

	handleInputError = event => {
		const { name, value } = event.target;
		if (name === "clientName") {
			if (value.length === 0) {
				return this.setState({
					clientNameError: true,
					formError: true
				});
			} else {
				return this.setState({
					clientNameError: false,
					formError: false
				});
			}
		}
	};

	handleSubmit = event => {
		event.preventDefault();
		const { clientName, productList } = this.state;
		if (!this.state.formError) {
			if (this.state.edit) {
				const order = {
					...this.props.data,
					client: clientName,
					vendeur: this.props.user.authedUser._id,
					arrayOrden: productList.map(item => {
						return { idproduit: item.idproduit, quantite: item.quantite };
					})
				};
				return this.props.dispatch(modifyOrder(order, this.props.onClose));
			}
			const order = {
				client: clientName,
				vendeur: this.props.user.authedUser._id,
				arrayOrden: productList.map(item => {
					return { idproduit: item.idproduit, quantite: item.quantite };
				})
			};
			this.props.dispatch(createOrder(order, this.props.onClose));
		} else {
			this.setState({ isModalOpen: true });
		}
	};

	handleDeleteRow = (e, id) => {
		e.preventDefault();
		const newList = this.state.productList.filter(({ _id }) => _id !== id);
		this.setState({ productList: newList });
	};

	renderMessages = field => {
		let list = [];
		let error = field.concat("Error");
		switch (field) {
			case "clientName":
				list = ["Le Nom du Client ne peut pas être vide"];
				break;
			default:
				list = [];
		}
		return (
			<Message style={this.state[error] ? { display: "block" } : { display: "none" }} error size="small" list={list} />
		);
	};

	renderTotal = data => {
		const total = data.reduce((intTotal, objItem) => {
			return intTotal + parseInt(objItem.total);
		}, 0);

		return total;
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			let rows;
			if (this.state.view) {
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
			} else {
				rows = data.map(item => {
					return (
						<Table.Row key={item.idproduit}>
							<Table.Cell>{item.nom}</Table.Cell>
							<Table.Cell>{item.prixUnite}</Table.Cell>
							<Table.Cell>{item.quantite}</Table.Cell>
							<Table.Cell>{item.total}</Table.Cell>
							<Table.Cell collapsing>
								<Button
									icon="minus square"
									color="red"
									onClick={e => {
										this.handleDeleteRow(e, item._id);
									}}
								/>
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
		const { isLoading, results } = this.state;
		let title = "Entrain de Ajouter une Commande";
		let label = "Ajouter";
		if (this.state.edit) {
			title = "Entrain de Modifier le Commande";
			label = "Modifier";
		} else if (this.state.view) {
			title = "Entrain de Voir le Commande";
		}

		if (this.state.view) {
			return (
				<Dimmer.Dimmable dimmed={this.state.isModalOpen}>
					<Dimmer verticalAlign="top" active={this.state.isModalOpen} page onClickOutside={this.handleModalClose}>
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
							<Card.Meta className="font font-16" textAlign="center">
								Completer les champs du formulaire
							</Card.Meta>
							<div className={styles.basicFormContainer}>
								<Form className={styles.basicFormWidth}>
									<Form.Group grouped>
										<Form.Field required>
											<label className={styles.basicFormSpacing}>Nom du Client</label>
											<Input
												disabled={this.state.view}
												icon="code"
												iconPosition="left"
												placeholder="Nom du Client"
												name="clientName"
												value={this.state.clientName}
											/>
										</Form.Field>
										<div className={styles.basicFormSpacing}>
											<Table selectable compact celled striped size="small">
												<Table.Header>
													<Table.Row>
														<Table.HeaderCell>Nom de Produit</Table.HeaderCell>
														<Table.HeaderCell>Prix per Unite</Table.HeaderCell>
														<Table.HeaderCell>Quantite</Table.HeaderCell>
														<Table.HeaderCell>Total</Table.HeaderCell>
													</Table.Row>
												</Table.Header>
												<Table.Body>{this.renderTableRows(this.state.productList)}</Table.Body>
											</Table>
										</div>
										<div className={styles.labelSpacing}>Total: {this.state.total}</div>
									</Form.Group>
								</Form>
							</div>
						</Card.Content>
					</Card>
				</Dimmer.Dimmable>
			);
		}
		return (
			<Dimmer.Dimmable dimmed={this.state.isModalOpen}>
				<Dimmer verticalAlign="top" active={this.state.isModalOpen} page onClickOutside={this.handleModalClose}>
					<Message className={styles.dimmerMargin} negative>
						<Message.Item className={styles.noStyleList}>
							<Icon name="warning sign" size="huge" />
						</Message.Item>
						<Message.Header>{this.state.headerErrorMessage}</Message.Header>
						<Message.Content>{this.state.contentErrorMessage}</Message.Content>
					</Message>
				</Dimmer>
				<Modal open={this.state.isProductModalOpen} onClose={this.handleModalClose}>
					<CommandeProduitForm
						type={this.state.productModalType}
						item={this.state.item}
						addToList={this.addToList}
						reduceToList={this.reduceToList}
						onClose={this.handleModalClose}
					/>
				</Modal>
				<Card fluid centered className={styles.boxContainerWide}>
					<Card.Content>
						<Card.Header className="font font-18" textAlign="center">
							{title}
						</Card.Header>
						<Card.Meta className="font font-16" textAlign="center">
							Completer les champs du formulaire
						</Card.Meta>
						<div className={styles.basicFormContainer}>
							<Form className={styles.basicFormWidth}>
								<Form.Group grouped>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Nom du Client</label>
										<Input
											disabled={this.state.view}
											icon="code"
											iconPosition="left"
											placeholder="Nom du Client"
											name="clientName"
											onChange={this.handleChange}
											value={this.state.clientName}
											onKeyUp={this.handleInputError}
											onBlur={this.state.clientNameError ? null : this.handleInputError}
										/>
										{this.renderMessages("clientName")}
									</Form.Field>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Search a Produit</label>
										<Search
											input={{ icon: "search", iconPosition: "left" }}
											size="small"
											disabled={this.state.view}
											placeholder="Search a Produit"
											loading={isLoading}
											onResultSelect={this.handleResultSelect}
											onSearchChange={debounce(this.handleSearchChange, 500, {
												leading: true
											})}
											results={results}
											value={this.state.product}
											name="product"
										/>
									</Form.Field>
									<div className={styles.basicFormSpacing}>
										<Table selectable compact celled striped size="small">
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell>Nom de Produit</Table.HeaderCell>
													<Table.HeaderCell>Prix per Unite</Table.HeaderCell>
													<Table.HeaderCell>Quantite</Table.HeaderCell>
													<Table.HeaderCell>Total</Table.HeaderCell>
													<Table.HeaderCell>Actions</Table.HeaderCell>
												</Table.Row>
											</Table.Header>

											<Table.Body>{this.renderTableRows(this.state.productList)}</Table.Body>
										</Table>
									</div>
								</Form.Group>
							</Form>
						</div>
						<div className={styles.labelSpacing}>Total: {this.renderTotal(this.state.productList)}</div>
						<div style={this.state.view ? { display: "none" } : { display: "block" }}>
							<Button fluid size="small" color="teal" content={label} onClick={this.handleSubmit} />
						</div>
					</Card.Content>
				</Card>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ product, user }) {
	return { product, user };
}

export default connect(mapStateToProps)(CommandeForm);
