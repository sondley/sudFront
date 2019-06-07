import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Message, Dimmer, Icon, Card, Search, Table, Modal, Divider } from "semantic-ui-react";
import { createBuy, modifyBuy } from "../../redux/actions/buys";
import { getProviders } from "../../redux/actions/provider";
import { getProducts } from "../../redux/actions/product";
import { escapeRegExp, filter, debounce, isEmpty, slice, find } from "lodash";

// Internal Components
import BuyProductForm from "../buy-product-form/buyproductform";
import ProduitForm from "../produit-form/produitform";
import ProviderForm from "../provider-form/providerform";

//Styles
import styles from "./buyform.module.css";

class BuyForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			edit: false || this.props.edit,
			view: false || this.props.view,
			headerErrorMessage: "",
			clientName: "",
			total: 0,
			product: "",
			productList: [],
			isModalOpen: false,
			isProductModalOpen: false,
			productModalType: "new",
			isProviderModalOpen: false,
			isNewProductModalOpen: false,
			results: [],
			item: {},
			fournisseur: {},
			isLoading: false
		};
	}

	componentDidMount = async () => {
		if (!this.state.view) {
			await this.props.dispatch(getProviders());
			await this.props.dispatch(getProducts());
			const provider = this.props.provider.providers[0];
			this.setState({ fournisseur: provider, clientName: provider.nom });
		}
		if (this.state.edit || this.state.view) {
			const provider = filter(this.props.provider.providers, { nom: this.props.data.provider });
			this.setState({
				clientName: this.props.data.provider,
				total: this.props.data.total,
				productList: this.props.data.arrayAchat,
				fournisseur: provider[0]
			});
		}
	};

	handleChange = event => {
		event.preventDefault();
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	handleModalClose = () => {
		this.setState({
			isModalOpen: false,
			isProductModalOpen: false,
			isProviderModalOpen: false,
			isNewProductModalOpen: false
		});
	};

	addToList = (id, name, priceUnit, quantity, mode) => {
		const newProduct = {
			idProduit: id,
			nom: name,
			prixUnite: priceUnit,
			quantite: quantity,
			total: parseInt(priceUnit) * parseInt(quantity),
			mode
		};
		const newList = this.state.productList.concat(newProduct);
		this.setState({ productList: newList });
	};

	reduceToList = (id, quantity) => {
		let repeatedItem = find(this.state.productList, { idProduit: id });
		const newProduct = {
			...repeatedItem,
			quantite: quantity + repeatedItem.quantite,
			total: parseInt(repeatedItem.prixUnite) * parseInt(quantity + repeatedItem.quantite)
		};
		const newList = this.state.productList.map(item => {
			if (item.idProduit !== newProduct.idProduit) {
				return item;
			}
			return { ...item, ...newProduct };
		});
		this.setState({ productList: newList });
	};

	resetComponent = name => this.setState({ isLoading: false, results: [], [name]: "" });

	handleResultSelect = (e, data) => {
		if (data.name === "product") {
			const getProduct = id => filter(this.props.product.products, { _id: id });
			const item = getProduct(data.result.id);
			let repeatedItem = find(this.state.productList, { idProduit: item[0]._id });
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
		}
		const getProvider = id => filter(this.props.provider.providers, { _id: id });
		const item = getProvider(data.result.id);
		return this.setState({ results: [], clientName: item[0].nom, fournisseur: item[0] });
	};

	handleSearchChange = (e, { value, name }) => {
		this.setState({ [name]: value, isLoading: true });

		setTimeout(() => {
			if (this.state[name].length < 1) return this.resetComponent(name);
			let source = {};
			if (name === "product") {
				source = this.props.product.products.map(item => {
					return { id: item._id, title: item.nom };
				});
			} else {
				source = this.props.provider.providers.map(item => {
					return { id: item._id, title: item.nom };
				});
			}

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

	handleAddProvider = e => {
		this.setState({ isProviderModalOpen: true });
	};

	handleAddProduct = e => {
		this.setState({ isNewProductModalOpen: true });
	};

	handleSubmit = event => {
		event.preventDefault();
		const { productList, fournisseur } = this.state;
		if (!this.state.formError) {
			if (this.state.edit) {
				const achat = {
					...this.props.data,
					idProvider: fournisseur._id,
					idUser: this.props.user.authedUser._id,
					arrayAchat: productList.map(item => {
						return { idProduit: item.idProduit, quantite: item.quantite, prixUnite: item.prixUnite, mode: item.mode };
					})
				};
				return this.props.dispatch(modifyBuy(achat, this.props.onClose));
			}
			const achat = {
				idProvider: fournisseur._id,
				idUser: this.props.user.authedUser._id,
				arrayAchat: productList.map(item => {
					return { idProduit: item.idProduit, quantite: item.quantite, prixUnite: item.prixUnite, mode: item.mode };
				})
			};
			this.props.dispatch(createBuy(achat, this.props.onClose));
		} else {
			this.setState({ isModalOpen: true });
		}
	};

	handleDeleteRow = (e, id) => {
		e.preventDefault();
		const newList = this.state.productList.filter(({ _id }) => _id !== id);
		this.setState({ productList: newList });
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
			rows = data.map(item => {
				if (this.state.view) {
					return (
						<Table.Row key={item._id}>
							<Table.Cell>{item.nom}</Table.Cell>
							<Table.Cell>{item.mode}</Table.Cell>
							<Table.Cell>{item.prixUnite}</Table.Cell>
							<Table.Cell>{item.quantite}</Table.Cell>
							<Table.Cell>{item.total}</Table.Cell>
						</Table.Row>
					);
				} else {
					return (
						<Table.Row key={item.idProduit}>
							<Table.Cell>{item.nom}</Table.Cell>
							<Table.Cell>{item.mode}</Table.Cell>
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
				}
			});
			return rows;
		}
		return;
	};

	renderTotals = etat => {
		if (etat === "0") {
			return (
				<div className={styles.labelMultipleSpacing}>
					<label className={styles.flexEnd}>Transport Frais: ${this.props.data.transportFrais}.00 HTD</label>
					<label className={styles.flexEnd}>Autres: ${this.props.data.autres}.00 HTD</label>
					<Divider />
					<label className={styles.flexEnd}>Total: ${this.props.data.totalFinal}.00 HTD</label>
				</div>
			);
		}
		return <div className={styles.labelSpacing}>Total: ${this.state.total}.00 HTD</div>;
	};

	render() {
		const { isLoading, results } = this.state;
		let title = "Entrain de Faire un Achat";
		let label = "Ajouter";
		if (this.state.edit) {
			title = "Entrain de Modifier l'Achat";
			label = "Modifier";
		} else if (this.state.view) {
			title = "Entrain de Voir l'Achat";
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
							<div className={styles.basicFormContainer}>
								<Form className={styles.basicFormWidth}>
									<Form.Group grouped>
										<Form.Field required>
											<label className={styles.basicFormSpacing}>Nom du Fournisseur</label>
											<Input
												disabled={this.state.view}
												icon="code"
												iconPosition="left"
												placeholder="Nom du Fournisseur"
												name="clientName"
												value={this.state.clientName}
											/>
										</Form.Field>
										<div className={styles.basicFormSpacing}>
											<Table selectable compact celled striped size="small">
												<Table.Header>
													<Table.Row>
														<Table.HeaderCell>Nom du Produit</Table.HeaderCell>
														<Table.HeaderCell>Mode</Table.HeaderCell>
														<Table.HeaderCell>Prix Unite</Table.HeaderCell>
														<Table.HeaderCell>Quantite</Table.HeaderCell>
														<Table.HeaderCell>Total</Table.HeaderCell>
													</Table.Row>
												</Table.Header>
												<Table.Body>{this.renderTableRows(this.state.productList)}</Table.Body>
											</Table>
										</div>
										{this.renderTotals(this.props.data.etat)}
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
					<BuyProductForm
						type={this.state.productModalType}
						item={this.state.item}
						addToList={this.addToList}
						reduceToList={this.reduceToList}
						onClose={this.handleModalClose}
					/>
				</Modal>
				<Modal open={this.state.isNewProductModalOpen} onClose={this.handleModalClose}>
					<ProduitForm achat data={this.state.clientName} onClose={this.handleModalClose} />
				</Modal>
				<Modal open={this.state.isProviderModalOpen} onClose={this.handleModalClose}>
					<ProviderForm onClose={this.handleModalClose} />
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
										<label className={styles.basicFormSpacing}>Nom du Fournisseur</label>
										<div className={styles.spaceBetween}>
											<Search
												style={{ flex: 5 }}
												input={{ icon: "search", iconPosition: "left" }}
												size="small"
												disabled={this.state.view}
												placeholder="Search a Fournisseur"
												loading={isLoading}
												onResultSelect={this.handleResultSelect}
												onSearchChange={debounce(this.handleSearchChange, 500, {
													leading: true
												})}
												results={results}
												value={this.state.clientName}
												name="clientName"
											/>
											<Button
												style={{ flex: 2, marginLeft: "5px" }}
												icon
												labelPosition="left"
												positive
												size="small"
												onClick={this.handleAddProvider}
											>
												<Icon name="add" /> Ajouter un Fournisseur
											</Button>
										</div>
									</Form.Field>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Search a Produit</label>
										<div className={styles.spaceBetween}>
											<Search
												style={{ flex: 3 }}
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
											<Button
												disabled={this.state.clientName === ""}
												style={{ flex: 1, marginLeft: "5px" }}
												icon
												labelPosition="left"
												positive
												size="small"
												onClick={this.handleAddProduct}
											>
												<Icon name="add" /> Ajouter un Produit
											</Button>
										</div>
									</Form.Field>
									<div className={styles.basicFormSpacing}>
										<Table selectable compact celled striped size="small">
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell>Nom du Produit</Table.HeaderCell>
													<Table.HeaderCell>Mode</Table.HeaderCell>
													<Table.HeaderCell>Prix Unite</Table.HeaderCell>
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

function mapStateToProps({ product, user, provider }) {
	return { product, user, provider };
}

export default connect(mapStateToProps)(BuyForm);
