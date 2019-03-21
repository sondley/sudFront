import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Internal Components
import ProduitForm from "../produit-form/produitform";

//Logic
import { getProducts, deleteProduct } from "../../redux/actions/product";

//Styles
import styles from "./produittable.module.css";

class ProduitTable extends PureComponent {
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
		await this.props.dispatch(getProducts());
		const allItems = this.props.product.products;
		const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
		const currentItems = allItems.slice(0, this.state.pageLimit);
		this.setState({ allItems, currentItems, totalPages });
	}

	componentDidUpdate = () => {
		if (this.state.allItems !== this.props.product.products) {
			const allItems = this.props.product.products;
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
		this.props.dispatch(deleteProduct(this.state.data.id, this.handleCloseModal));
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

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const { role } = this.props.user.authedUser;
				if (role === "assistance" || role === "directeur") {
					return (
						<Table.Row
							key={item._id}
							onClick={e => {
								this.handleRowClick(e, item);
							}}
						>
							<Table.Cell>{item.nom}</Table.Cell>
							<Table.Cell>{item.provider}</Table.Cell>
							<Table.Cell>{item.size}</Table.Cell>
							<Table.Cell>{item.sellPrice}</Table.Cell>
							<Table.Cell>{item.unit}</Table.Cell>
							<Table.Cell>{item.limit}</Table.Cell>
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
				return (
					<Table.Row
						key={item._id}
						onClick={e => {
							this.handleRowClick(e, item);
						}}
					>
						<Table.Cell>{item.nom}</Table.Cell>
						<Table.Cell>{item.provider}</Table.Cell>
						<Table.Cell>{item.size}</Table.Cell>
						<Table.Cell>{item.sellPrice}</Table.Cell>
						<Table.Cell>{item.unit}</Table.Cell>
						<Table.Cell>{item.limit}</Table.Cell>
					</Table.Row>
				);
			});
			return rows;
		}
		return;
	};

	render() {
		const { role } = this.props.user.authedUser;
		const { allItems, currentItems, activePage, totalPages, pageLimit } = this.state;
		const itemRange = (activePage - 1) * pageLimit;
		const totalItems = allItems.length;
		if (role === "assistance" || role === "directeur") {
			return (
				<Dimmer.Dimmable blurring dimmed={this.props.product.isFetching}>
					<Dimmer page active={this.props.product.isFetching}>
						<Loader size="huge">Loading...</Loader>
					</Dimmer>
					<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
						<ProduitForm edit data={this.state.data} onClose={this.handleCloseModal} />
					</Modal>
					<Modal open={this.state.viewModal} onClose={this.handleCloseModal}>
						<ProduitForm view data={this.state.data} onClose={this.handleCloseModal} />
					</Modal>
					<Modal size="small" open={this.state.deleteModal} onClose={this.handleCloseModal}>
						<Modal.Header>Eliminer Produit</Modal.Header>
						<Modal.Content>
							<p>Es-tu sure que tu veux eliminer le produit?</p>
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
									<Table.HeaderCell>Nom</Table.HeaderCell>
									<Table.HeaderCell>Fournisseur</Table.HeaderCell>
									<Table.HeaderCell>Unite</Table.HeaderCell>
									<Table.HeaderCell>Prix de Vente</Table.HeaderCell>
									<Table.HeaderCell>Quantite</Table.HeaderCell>
									<Table.HeaderCell>Limite</Table.HeaderCell>
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
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.product.isFetching}>
				<Dimmer page active={this.props.product.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.viewModal} onClose={this.handleCloseModal}>
					<ProduitForm view data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<div>
					<Table selectable compact celled striped size="small">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Nom</Table.HeaderCell>
								<Table.HeaderCell>Fournisseur</Table.HeaderCell>
								<Table.HeaderCell>Unite</Table.HeaderCell>
								<Table.HeaderCell>Prix de Vente</Table.HeaderCell>
								<Table.HeaderCell>Quantite</Table.HeaderCell>
								<Table.HeaderCell>Limite</Table.HeaderCell>
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

function mapStateToProps({ product, user }) {
	return { product, user };
}

export default connect(mapStateToProps)(ProduitTable);
