import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal, Message, Form, Input } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Internal Components
import BuyForm from "../buy-form/buyform";

//Logic
import { getBuys, deleteBuy, validateBuy } from "../../redux/actions/buys";

//Styles
import styles from "./buytable.module.css";

class BuyTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			viewModal: false,
			deleteModal: false,
			validateModal: false,
			errorModal: false,
			allItems: [],
			currentItems: [],
			totalPages: 0,
			activePage: 1,
			pageLimit: 10,
			data: {},
			transportFrais: 0,
			autres: 0,
			ammount: ""
		};
	}

	componentDidMount = async () => {
		await this.props.dispatch(getBuys());
		const allItems = this.props.buy.buys;
		const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
		const currentItems = allItems.slice(0, this.state.pageLimit);
		this.setState({ allItems, currentItems, totalPages });
	};

	componentDidUpdate = () => {
		if (this.state.allItems !== this.props.buy.buys) {
			const allItems = this.props.buy.buys;
			const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
			const currentItems = allItems.slice(0, this.state.pageLimit);
			this.setState({ allItems, currentItems, totalPages });
		}
	};

	onPageChanged = (e, data) => {
		e.preventDefault();
		const { allItems, pageLimit } = this.state;
		const { activePage } = data;
		const offset = (activePage - 1) * pageLimit;
		const currentItems = allItems.slice(offset, offset + pageLimit);
		this.setState({ activePage, currentItems });
	};

	renderItemCount = (itemRange, currentItems, totalItems) => {
		if (currentItems.length <= 1) {
			return (
				<label className={styles.itemCount}>
					Items: {itemRange + currentItems.length}/{totalItems}
				</label>
			);
		} else {
			return (
				<label className={styles.itemCount}>
					Items: {itemRange + 1}-{itemRange + currentItems.length}/{totalItems}
				</label>
			);
		}
	};

	handleEdit = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		this.setState({ data: item, editModal: true });
	};

	handleValidate = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		this.setState({ data: item, validateModal: true });
	};

	handleRowClick = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		if (!e.target.classList.contains("collapsing")) {
			this.setState({ data: item, viewModal: true });
		}
	};

	handleDelete = e => {
		e.preventDefault();
		this.props.dispatch(deleteBuy(this.state.data.id, this.handleCloseModal));
	};

	handleOpenModal = (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		const data = { id };
		this.setState({ data, deleteModal: true });
	};

	handleCloseModal = () => {
		this.setState({ editModal: false, deleteModal: false, viewModal: false, validateModal: false, errorModal: false });
	};

	handleSubmit = e => {
		e.preventDefault();
		if (this.state.ammount !== "") {
			const valider = {
				idUser: this.props.user.authedUser._id,
				idAchat: this.state.data,
				transportFrais: this.state.transportFrais,
				autres: this.state.autres,
				montant: this.state.ammount
			};
			return this.props.dispatch(validateBuy(valider, this.handleCloseModal));
		}
		this.setState({ errorModal: true });
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		if (parseInt(value) < 0) {
			return this.setState({ [name]: 0 });
		}
		this.setState({ [name]: value });
	};

	handleChange = (e, { value }) => this.setState({ value });

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const estado = item.etat === "0" ? "check" : "close";
				const color = item.etat === "0" ? "green" : "red";
				const total = "$" + item.total + ".00 HTG";
				const totalFinal = "$" + item.totalFinal + ".00 HTG";
				const date = new Date(item.created);
				if (this.props.user.authedUser.role === "contable") {
					if (item.etat === "0") {
						return (
							<Table.Row
								key={item._id}
								onClick={e => {
									this.handleRowClick(e, item);
								}}
							>
								<Table.Cell>{item.provider}</Table.Cell>
								<Table.Cell>{item.acheteur}</Table.Cell>
								<Table.Cell>
									<Icon name={estado} color={color} />
								</Table.Cell>
								<Table.Cell>{item.valideur}</Table.Cell>
								<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
								<Table.Cell>{totalFinal}</Table.Cell>
								<Table.Cell collapsing disabled>
									<div className={styles.cellSpacingFor3}>
										<Button content="Valider" color="grey" />
										<div className={styles.responsiveCell}>
											<Button icon="edit" color="grey" />
											<Button icon="trash" color="grey" />
										</div>
									</div>
								</Table.Cell>
							</Table.Row>
						);
					}
					return (
						<Table.Row
							key={item._id}
							onClick={e => {
								this.handleRowClick(e, item);
							}}
						>
							<Table.Cell>{item.provider}</Table.Cell>
							<Table.Cell>{item.acheteur}</Table.Cell>
							<Table.Cell>
								<Icon name={estado} color={color} />
							</Table.Cell>
							<Table.Cell>{"Non-Valide"}</Table.Cell>
							<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
							<Table.Cell>{total}</Table.Cell>
							<Table.Cell collapsing>
								<div className={styles.cellSpacingFor3}>
									<Button
										content="Valider"
										color="green"
										onClick={e => {
											this.handleValidate(e, item);
										}}
									/>
									<div className={styles.responsiveCell}>
										<Button
											icon="edit"
											color="blue"
											onClick={e => {
												this.handleEdit(e, item);
											}}
										/>
										<Button
											icon="trash"
											color="red"
											onClick={e => {
												this.handleOpenModal(e, item._id);
											}}
										/>
									</div>
								</div>
							</Table.Cell>
						</Table.Row>
					);
				} else {
					if (item.etat === "0") {
						return (
							<Table.Row
								key={item._id}
								onClick={e => {
									this.handleRowClick(e, item);
								}}
							>
								<Table.Cell>{item.provider}</Table.Cell>
								<Table.Cell>{item.acheteur}</Table.Cell>
								<Table.Cell>
									<Icon name={estado} color={color} />
								</Table.Cell>
								<Table.Cell>{item.valideur}</Table.Cell>
								<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
								<Table.Cell>{total}</Table.Cell>
								<Table.Cell collapsing disabled>
									<div className={styles.cellSpacing}>
										<Button icon="edit" color="grey" />
										<Button icon="trash" color="grey" />
									</div>
								</Table.Cell>
							</Table.Row>
						);
					}
					return (
						<Table.Row
							key={item._id}
							onClick={e => {
								this.handleRowClick(e, item);
							}}
						>
							<Table.Cell>{item.provider}</Table.Cell>
							<Table.Cell>{item.acheteur}</Table.Cell>
							<Table.Cell>
								<Icon name={estado} color={color} />
							</Table.Cell>
							<Table.Cell>{"Non-Valide"}</Table.Cell>
							<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
							<Table.Cell>{total}</Table.Cell>
							<Table.Cell collapsing>
								<div className={styles.cellSpacing}>
									<Button
										icon="edit"
										color="blue"
										onClick={e => {
											this.handleEdit(e, item);
										}}
									/>
									<Button
										icon="trash"
										color="red"
										onClick={e => {
											this.handleOpenModal(e, item._id);
										}}
									/>
								</div>
							</Table.Cell>
						</Table.Row>
					);
				}
			});
			return rows;
		}
		return;
	};

	renderEffectif = payer => {
		const monnaie = this.state.ammount - payer;
		const text = monnaie > 0 ? "Monnaie: $" + monnaie + ".00 HTG" : "Dette: $" + monnaie + ".00 HTG";
		return (
			<div>
				<Form.Field required>
					<label className={styles.basicFormSpacing}>Montant donné</label>
					<Input
						icon="money"
						iconPosition="left"
						placeholder="montant donné"
						name="ammount"
						type="number"
						onChange={this.handleInputOnChange}
						value={this.state.ammount}
					/>
				</Form.Field>
				<Form.Field className={styles.centered}>{text}</Form.Field>
			</div>
		);
	};

	renderModal = validateModal => {
		const payer = parseInt(this.state.data.total) + parseInt(this.state.autres) + parseInt(this.state.transportFrais);
		return (
			<Modal size="small" open={validateModal} onClose={this.handleCloseModal}>
				<Modal.Header>Valider Achat</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field className={styles.centered}>
							Total Achat: <strong>${parseInt(this.state.data.total)}.00 HTG</strong>
						</Form.Field>
						<Form.Field required>
							<label className={styles.basicFormSpacing}>Transport Frais</label>
							<Input
								icon="money"
								iconPosition="left"
								placeholder="Transport Frais"
								name="transportFrais"
								type="number"
								onChange={this.handleInputOnChange}
								value={this.state.transportFrais}
							/>
						</Form.Field>
						<Form.Field required>
							<label className={styles.basicFormSpacing}>Autres</label>
							<Input
								icon="money"
								iconPosition="left"
								placeholder="Autres"
								name="autres"
								type="number"
								onChange={this.handleInputOnChange}
								value={this.state.autres}
							/>
						</Form.Field>
						<Form.Field className={styles.centered}>
							Montant a Payer: <strong>${payer}.00 HTG</strong>
						</Form.Field>
						{this.renderEffectif(payer)}
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button
						className={styles.rightSpacing}
						negative
						icon="cancel"
						labelPosition="right"
						content="Non"
						onClick={this.handleCloseModal}
					/>
					<Button
						className={styles.leftSpacing}
						positive
						icon="checkmark"
						labelPosition="right"
						content="Oui"
						onClick={this.handleSubmit}
					/>
				</Modal.Actions>
			</Modal>
		);
	};

	render() {
		const { allItems, currentItems, activePage, totalPages, pageLimit } = this.state;
		const itemRange = (activePage - 1) * pageLimit;
		const totalItems = allItems.length;
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.buy.isFetching}>
				<Dimmer page active={this.props.buy.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
					<BuyForm edit data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal open={this.state.viewModal} onClose={this.handleCloseModal}>
					<BuyForm view data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				{this.renderModal(this.state.validateModal)}
				<Modal open={this.state.errorModal} onClose={this.handleCloseModal}>
					<Message className={styles.dimmerMargin} error>
						<Message.Item className={styles.noStyleList}>
							<Icon name="warning sign" size="huge" />
						</Message.Item>
						<Message.Content
							content="les champs de frais de transport et autres frais ne peuvent pas etre vide"
							className={styles.paddingBottom}
						/>
					</Message>
				</Modal>
				<Modal size="small" open={this.state.deleteModal} onClose={this.handleCloseModal}>
					<Modal.Header>Eliminer Achat</Modal.Header>
					<Modal.Content>
						<p>Es-tu sure que tu veux eliminer l'achat?</p>
					</Modal.Content>
					<Modal.Actions>
						<Button
							className={styles.rightSpacing}
							negative
							icon="cancel"
							labelPosition="right"
							content="Non"
							onClick={this.handleCloseModal}
						/>
						<Button
							className={styles.leftSpacing}
							positive
							icon="checkmark"
							labelPosition="right"
							content="Oui"
							onClick={this.handleDelete}
						/>
					</Modal.Actions>
				</Modal>
				<div>
					<Table selectable compact celled striped size="small">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Nom du Fournisseur</Table.HeaderCell>
								<Table.HeaderCell>Nom du Acheteur</Table.HeaderCell>
								<Table.HeaderCell>Etat</Table.HeaderCell>
								<Table.HeaderCell>Nom du Valideur</Table.HeaderCell>
								<Table.HeaderCell>Date</Table.HeaderCell>
								<Table.HeaderCell>Total</Table.HeaderCell>
								<Table.HeaderCell>Actions</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>{this.renderTableRows(currentItems)}</Table.Body>
					</Table>
					<div className={styles.pagination}>
						<Pagination
							activePage={activePage}
							ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
							firstItem={{ content: <Icon name="angle double left" />, icon: true }}
							lastItem={{ content: <Icon name="angle double right" />, icon: true }}
							prevItem={{ content: <Icon name="angle left" />, icon: true }}
							nextItem={{ content: <Icon name="angle right" />, icon: true }}
							totalPages={totalPages}
							onPageChange={this.onPageChanged}
						/>
						{this.renderItemCount(itemRange, currentItems, totalItems)}
					</div>
				</div>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ buy, user }) {
	return { buy, user };
}

export default connect(mapStateToProps)(BuyTable);
