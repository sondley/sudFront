import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Internal Components
import CommandeForm from "../commande-form/commandeform";

//Logic
import { getOrders, deleteOrder } from "../../redux/actions/order";

//Styles
import styles from "./commandetable.module.css";

class CommandeTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			viewModal: false,
			deleteModal: false,
			allItems: [],
			currentItems: [],
			totalPages: 0,
			activePage: 1,
			pageLimit: 10,
			data: {}
		};
	}

	async componentDidMount() {
		await this.props.dispatch(getOrders());
		const allItems = this.props.order.orders;
		const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
		const currentItems = allItems.slice(0, this.state.pageLimit);
		this.setState({ allItems, currentItems, totalPages });
	}

	componentDidUpdate = () => {
		if (this.state.allItems !== this.props.order.orders) {
			const allItems = this.props.order.orders;
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
		this.setState({ data: item, editModal: true, viewModal: false });
	};

	handleRowClick = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		if (!e.target.classList.contains("collapsing")) {
			this.setState({ data: item, viewModal: true, editModal: false });
		}
	};

	handleDelete = e => {
		e.preventDefault();
		this.props.dispatch(deleteOrder(this.state.data.id, this.handleCloseModal));
	};

	handleOpenModal = (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		const data = { id };
		this.setState({ data, deleteModal: true });
	};

	handleCloseModal = () => {
		this.setState({ editModal: false, deleteModal: false, viewModal: false });
	};

	renderTotal = data => {
		const total = data.reduce((intTotal, objItem) => {
			if (objItem.etat === "0") {
				return intTotal + parseInt(objItem.totalFinal);
			}
			return intTotal;
		}, 0);

		return total;
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const estado = item.etat === "0" ? "check" : "close";
				const color = item.etat === "0" ? "green" : "red";
				const total = "$" + item.totalFinal + ".00 HTG";
				const date = new Date(item.created);
				if (item.etat === "0" && this.props.proxy) {
					return (
						<Table.Row
							key={item._id}
							onClick={e => {
								this.handleRowClick(e, item);
							}}
						>
							<Table.Cell>{item.client}</Table.Cell>
							<Table.Cell>{item.vendeur}</Table.Cell>
							<Table.Cell>
								<Icon name={estado} color={color} />
							</Table.Cell>
							<Table.Cell>{item.valideur}</Table.Cell>
							<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
							<Table.Cell>{total}</Table.Cell>
						</Table.Row>
					);
				} else if (item.etat === "0") {
					return (
						<Table.Row
							key={item._id}
							onClick={e => {
								this.handleRowClick(e, item);
							}}
						>
							<Table.Cell>{item.client}</Table.Cell>
							<Table.Cell>{item.vendeur}</Table.Cell>
							<Table.Cell>
								<Icon name={estado} color={color} />
							</Table.Cell>
							<Table.Cell>{item.valideur}</Table.Cell>
							<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
							<Table.Cell>{total}</Table.Cell>
							<Table.Cell collapsing disabled>
								<div className={styles.cellSpacing}>
									<Button
										icon="edit"
										color="grey"
										onClick={e => {
											this.handleEdit(e, item);
										}}
									/>
									<Button
										icon="trash"
										color="grey"
										onClick={e => {
											this.handleOpenModal(e, item._id);
										}}
									/>
								</div>
							</Table.Cell>
						</Table.Row>
					);
				} else if (item.etat === "1" && this.props.proxy) {
					return (
						<Table.Row
							key={item._id}
							onClick={e => {
								this.handleRowClick(e, item);
							}}
						>
							<Table.Cell>{item.client}</Table.Cell>
							<Table.Cell>{item.vendeur}</Table.Cell>
							<Table.Cell>
								<Icon name={estado} color={color} />
							</Table.Cell>
							<Table.Cell>{"Non-Valide"}</Table.Cell>
							<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
							<Table.Cell>{total}</Table.Cell>
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
						<Table.Cell>{item.client}</Table.Cell>
						<Table.Cell>{item.vendeur}</Table.Cell>
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
			});
			return rows;
		}
		return;
	};

	render() {
		const { allItems, currentItems, activePage, totalPages, pageLimit } = this.state;
		const itemRange = (activePage - 1) * pageLimit;
		const totalItems = allItems.length;
		if (this.props.proxy) {
			return (
				<Dimmer.Dimmable blurring dimmed={this.props.order.isFetching}>
					<Dimmer page active={this.props.order.isFetching}>
						<Loader size="huge">Loading...</Loader>
					</Dimmer>
					<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
						<CommandeForm edit data={this.state.data} onClose={this.handleCloseModal} />
					</Modal>
					<Modal open={this.state.viewModal} onClose={this.handleCloseModal}>
						<CommandeForm view data={this.state.data} onClose={this.handleCloseModal} />
					</Modal>
					<Modal size="small" open={this.state.deleteModal} onClose={this.handleCloseModal}>
						<Modal.Header>Eliminer Commande</Modal.Header>
						<Modal.Content>
							<p>Es-tu sure que tu veux eliminer la commande?</p>
						</Modal.Content>
						<Modal.Actions>
							<Button
								className={styles.rightSpacing}
								negative
								icon="cancel"
								labelPosition="right"
								content="No"
								onClick={this.handleCloseModal}
							/>
							<Button
								className={styles.leftSpacing}
								positive
								icon="checkmark"
								labelPosition="right"
								content="Yes"
								onClick={this.handleDelete}
							/>
						</Modal.Actions>
					</Modal>
					<div>
						<Table selectable compact celled striped size="small">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Nom de Client</Table.HeaderCell>
									<Table.HeaderCell>Nom de Vendeur</Table.HeaderCell>
									<Table.HeaderCell>Etat</Table.HeaderCell>
									<Table.HeaderCell>Nom de Valideur</Table.HeaderCell>
									<Table.HeaderCell>Date</Table.HeaderCell>
									<Table.HeaderCell>Total</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>{this.renderTableRows(currentItems)}</Table.Body>
						</Table>
						<div>
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
						<div className={styles.labelSpacing}>Total: ${this.renderTotal(this.props.order.orders)}.00 HTG</div>
					</div>
				</Dimmer.Dimmable>
			);
		}
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.order.isFetching}>
				<Dimmer page active={this.props.order.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
					<CommandeForm edit data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal open={this.state.viewModal} onClose={this.handleCloseModal}>
					<CommandeForm view data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal size="small" open={this.state.deleteModal} onClose={this.handleCloseModal}>
					<Modal.Header>Eliminer Commande</Modal.Header>
					<Modal.Content>
						<p>Es-tu sure que tu veux eliminer la commande?</p>
					</Modal.Content>
					<Modal.Actions>
						<Button
							className={styles.rightSpacing}
							negative
							icon="cancel"
							labelPosition="right"
							content="No"
							onClick={this.handleCloseModal}
						/>
						<Button
							className={styles.leftSpacing}
							positive
							icon="checkmark"
							labelPosition="right"
							content="Yes"
							onClick={this.handleDelete}
						/>
					</Modal.Actions>
				</Modal>
				<div>
					<Table selectable compact celled striped size="small">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Nom de Client</Table.HeaderCell>
								<Table.HeaderCell>Nom de Vendeur</Table.HeaderCell>
								<Table.HeaderCell>Etat</Table.HeaderCell>
								<Table.HeaderCell>Nom de Valideur</Table.HeaderCell>
								<Table.HeaderCell>Date</Table.HeaderCell>
								<Table.HeaderCell>Total</Table.HeaderCell>
								<Table.HeaderCell>Actions</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>{this.renderTableRows(currentItems)}</Table.Body>
					</Table>
					<div>
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

function mapStateToProps({ order }) {
	return { order };
}

export default connect(mapStateToProps)(CommandeTable);
