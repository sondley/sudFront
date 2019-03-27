import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Input, TextArea, Button, Message, Dimmer, Icon, Card, Search } from "semantic-ui-react";
import { createProduct, modifyProduct } from "../../redux/actions/product";
import { getProviders } from "../../redux/actions/provider";
import { escapeRegExp, filter, debounce, isEmpty, slice } from "lodash";

//Styles
import styles from "./produitform.module.css";

class ProductForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			edit: false || this.props.edit,
			view: false || this.props.view,
			achat: false || this.props.achat,
			headerErrorMessage: "",
			name: "",
			fournisseur: "",
			size: "",
			qty: "",
			sellPrice: "",
			buyPrice: "",
			description: "",
			limit: "",
			nameError: false,
			sizeError: false,
			qtyError: false,
			sellPriceError: false,
			buyPriceError: false,
			limitError: false,
			formError: false,
			isModalOpen: false,
			results: [],
			item: {},
			isLoading: false
		};
	}

	async componentDidMount() {
		if (isEmpty(this.props.provider.providers)) {
			await this.props.dispatch(getProviders());
		}
		if (this.state.edit || this.state.view) {
			const provider = filter(this.props.provider.providers, { nom: this.props.data.provider });
			this.setState({
				name: this.props.data.nom,
				fournisseur: this.props.data.provider,
				size: this.props.data.size,
				qty: this.props.data.unit,
				sellPrice: this.props.data.sellPrice,
				buyPrice: this.props.data.buyPrice,
				description: this.props.data.Description,
				limit: this.props.data.limit,
				item: provider[0]
			});
		}
		if (this.state.achat) {
			console.log(this.props.data);
			const provider = filter(this.props.provider.providers, { nom: this.props.data });
			this.setState({
				fournisseur: this.props.data,
				item: provider[0]
			});
		}
	}

	handleChange = event => {
		event.preventDefault();
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	handleModalClose = () => {
		this.setState({ isModalOpen: false });
	};

	handleInputError = event => {
		const { name, value } = event.target;
		if (name === "name") {
			if (value.length === 0) {
				return this.setState({
					nameError: true,
					formError: true
				});
			} else {
				return this.setState({
					nameError: false,
					formError: false
				});
			}
		}

		if (name === "size") {
			if (value.length === 0) {
				return this.setState({
					sizeError: true,
					formError: true
				});
			} else {
				return this.setState({
					sizeError: false,
					formError: false
				});
			}
		}

		if (name === "sellPrice") {
			const numVal = parseInt(value);
			if (value.length === 0 || numVal < 0) {
				return this.setState({
					sellPriceError: true,
					formError: true
				});
			} else {
				return this.setState({
					sellPriceError: false,
					formError: false
				});
			}
		}

		if (name === "buyPrice") {
			const numVal = parseInt(value);
			if (value.length === 0 || numVal < 0) {
				return this.setState({
					buyPriceError: true,
					formError: true
				});
			} else {
				return this.setState({
					buyPriceError: false,
					formError: false
				});
			}
		}
		if (name === "qty") {
			const numVal = parseInt(value);
			if (value.length === 0 || numVal < 0) {
				return this.setState({
					qtyError: true,
					formError: true
				});
			} else {
				return this.setState({
					qtyError: false,
					formError: false
				});
			}
		}
		if (name === "limit") {
			const numVal = parseInt(value);
			if (value.length === 0 || numVal < 0) {
				return this.setState({
					limitError: true,
					formError: true
				});
			} else {
				return this.setState({
					limitError: false,
					formError: false
				});
			}
		}
		if (name === "description") {
			if (value.length === 0) {
				return this.setState({
					descriptionError: true,
					formError: true
				});
			} else {
				return this.setState({
					descriptionError: false,
					formError: false
				});
			}
		}
	};

	handleSubmit = event => {
		event.preventDefault();
		const { name, qty, size, sellPrice, buyPrice, description, item, limit } = this.state;
		if (!this.state.formError && this.state.fournisseur.length > 0) {
			if (this.state.edit) {
				const product = {
					...this.props.data,
					name,
					fournisseur: item._id,
					qty,
					size,
					sellPrice,
					buyPrice,
					description,
					limit
				};
				return this.props.dispatch(modifyProduct(product, this.props.onClose));
			} else if (this.state.achat) {
				const product = {
					name,
					fournisseur: item._id,
					qty: 0,
					size,
					sellPrice: 0,
					buyPrice: 0,
					description,
					limit: 0
				};
				this.props.dispatch(createProduct(product, this.props.onClose));
			} else {
				const product = {
					name,
					fournisseur: item._id,
					qty,
					size,
					sellPrice,
					buyPrice,
					description,
					limit
				};
				this.props.dispatch(createProduct(product, this.props.onClose));
			}
		} else {
			this.setState({ isModalOpen: true });
		}
	};

	resetComponent = name => this.setState({ isLoading: false, results: [], [name]: "" });

	handleResultSelect = (e, data) => {
		const getProvider = id => filter(this.props.provider.providers, { _id: id });
		const item = getProvider(data.result.id);
		this.setState({ results: [], fournisseur: item[0].nom, item: item[0] });
	};

	handleSearchChange = (e, { value, name }) => {
		this.setState({ [name]: value, isLoading: true });

		setTimeout(() => {
			if (this.state[name].length < 1) return this.resetComponent(name);
			let source = this.props.provider.providers.map(item => {
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

	renderMessages = field => {
		let list = [];
		let error = field.concat("Error");
		switch (field) {
			case "name":
				list = ["Le Nom ne peut pas être vide"];
				break;
			case "size":
				list = ["La Taille ne peut pas être vide"];
				break;
			case "sellPrice":
				list = ["Le Prix de Vente ne peut pas être vide", "Le Prix de Vente doit être un numero >= 0"];
				break;
			case "buyPrice":
				list = ["Le Prix d'Achat ne peut pas être vide", "Le Prix d'Achat doit être un numero >= 0"];
				break;
			case "qty":
				list = ["La Quantité ne peut pas être vide", "La Quantité doit être un numero >= 0"];
				break;
			case "limit":
				list = ["La Limite ne peut pas être vide", "La Limite doit être un numero >= 0"];
				break;
			default:
				list = [];
		}
		return (
			<Message style={this.state[error] ? { display: "block" } : { display: "none" }} error size="small" list={list} />
		);
	};

	render() {
		const { isLoading, results } = this.state;
		let title = "Entrain de Ajouter";
		let label = "Ajouter";
		if (this.state.edit) {
			title = "Entrain de Modifier";
			label = "Modifier";
		} else if (this.state.view) {
			title = "Entrain de Voir";
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
										<label className={styles.basicFormSpacing}>Nom</label>
										<Input
											disabled={this.state.view}
											icon="code"
											iconPosition="left"
											placeholder="Nom du Produit"
											name="name"
											onChange={this.handleChange}
											value={this.state.name}
											onKeyUp={this.handleInputError}
											onBlur={this.state.nameError ? null : this.handleInputError}
										/>
										{this.renderMessages("name")}
									</Form.Field>
									<Form.Field required style={this.state.achat ? { display: "none" } : { display: "block" }}>
										<label className={styles.basicFormSpacing}>Fournisseur</label>
										<Search
											input={{ icon: "search", iconPosition: "left" }}
											size="small"
											disabled={this.state.view}
											placeholder="Fournisseur"
											loading={isLoading}
											onResultSelect={this.handleResultSelect}
											onSearchChange={debounce(this.handleSearchChange, 500, {
												leading: true
											})}
											results={results}
											value={this.state.fournisseur}
											name="fournisseur"
										/>
									</Form.Field>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Taille</label>
										<Input
											disabled={this.state.view}
											icon="mail"
											iconPosition="left"
											placeholder="Taille"
											name="size"
											onChange={this.handleChange}
											value={this.state.size}
											onKeyUp={this.handleInputError}
											onBlur={this.state.sizeError ? null : this.handleInputError}
										/>
										{this.renderMessages("size")}
									</Form.Field>
									<Form.Field required style={this.state.achat ? { display: "none" } : { display: "block" }}>
										<label className={styles.basicFormSpacing}>Prix de Vente</label>
										<Input
											disabled={this.state.view}
											type="number"
											icon="money"
											iconPosition="left"
											placeholder="Prix de Vente"
											name="sellPrice"
											onChange={this.handleChange}
											value={this.state.sellPrice}
											onKeyUp={this.handleInputError}
											onBlur={this.state.sellPriceError ? null : this.handleInputError}
										/>
										{this.renderMessages("sellPrice")}
									</Form.Field>
									<Form.Field required style={this.state.achat ? { display: "none" } : { display: "block" }}>
										<label className={styles.basicFormSpacing}>Prix d'Achat</label>
										<Input
											disabled={this.state.view}
											type="number"
											icon="money"
											iconPosition="left"
											placeholder="Prix d'Achat"
											name="buyPrice"
											onChange={this.handleChange}
											value={this.state.buyPrice}
											onKeyUp={this.handleInputError}
											onBlur={this.state.buyPriceError ? null : this.handleInputError}
										/>
										{this.renderMessages("buyPrice")}
									</Form.Field>
									<Form.Field
										required
										style={this.state.edit || this.state.achat ? { display: "none" } : { display: "block" }}
									>
										<label className={styles.basicFormSpacing}>Quantite</label>
										<Input
											disabled={this.state.view}
											type="number"
											icon="archive"
											iconPosition="left"
											placeholder="Quantite"
											name="qty"
											onChange={this.handleChange}
											value={this.state.qty}
											onKeyUp={this.handleInputError}
											onBlur={this.state.qtyError ? null : this.handleInputError}
										/>
										{this.renderMessages("qty")}
									</Form.Field>
									<Form.Field required style={this.state.achat ? { display: "none" } : { display: "block" }}>
										<label className={styles.basicFormSpacing}>Limite</label>
										<Input
											disabled={this.state.view}
											type="number"
											icon="certificate"
											iconPosition="left"
											placeholder="Limite"
											name="limit"
											onChange={this.handleChange}
											value={this.state.limit}
											onKeyUp={this.handleInputError}
											onBlur={this.state.limitError ? null : this.handleInputError}
										/>
										{this.renderMessages("limit")}
									</Form.Field>
									<Form.Field>
										<label className={styles.basicFormSpacing}>Description</label>
										<TextArea
											disabled={this.state.view}
											rows={3}
											placeholder="Description"
											name="description"
											onChange={this.handleChange}
											value={this.state.description}
										/>
									</Form.Field>
								</Form.Group>
							</Form>
						</div>
						<div style={this.state.view ? { display: "none" } : { display: "block" }}>
							<Button fluid size="small" color="teal" content={label} onClick={this.handleSubmit} />
						</div>
					</Card.Content>
				</Card>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ provider }) {
	return { provider };
}

export default connect(mapStateToProps)(ProductForm);
