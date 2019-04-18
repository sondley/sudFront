import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Internal Components
import TaxForm from "../tax-form/taxform";

//Logic
import { getTaxes, deleteTax } from "../../redux/actions/tax";

//Styles
import styles from "./taxtable.module.css";

class TaxTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			deleteModal: false,
			allItems: [],
			currentItems: [],
			totalPages: 0,
			activePage: 1,
			pageLimit: 10,
			data: {}
		};
	}

	componentDidMount = async () => {
		await this.props.dispatch(getTaxes());
		const allItems = this.props.tax.taxes;
		const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
		const currentItems = allItems.slice(0, this.state.pageLimit);
		this.setState({ allItems, currentItems, totalPages });
	};

	componentDidUpdate = () => {
		if (this.state.allItems !== this.props.tax.taxes) {
			const allItems = this.props.tax.taxes;
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

	handleDelete = e => {
		e.preventDefault();
		this.props.dispatch(deleteTax(this.state.data.id, this.handleCloseModal));
	};

	handleOpenModal = (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		const data = { id };
		this.setState({ data, deleteModal: true });
	};

	handleCloseModal = () => {
		this.setState({ editModal: false });
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const taxe = item.taxe + "%";
				return (
					<Table.Row key={item._id}>
						<Table.Cell>{item.nom}</Table.Cell>
						<Table.Cell>{taxe}</Table.Cell>
						<Table.Cell collapsing width={4}>
							<div>
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
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.tax.isFetching}>
				<Dimmer page active={this.props.tax.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
					<TaxForm edit data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal size="small" open={this.state.deleteModal} onClose={this.handleCloseModal}>
					<Modal.Header>Eliminer Impot</Modal.Header>
					<Modal.Content>
						<p>Es-tu sure que tu veux eliminer le impot?</p>
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
								<Table.HeaderCell>Nom</Table.HeaderCell>
								<Table.HeaderCell>Taxe</Table.HeaderCell>
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

function mapStateToProps({ tax }) {
	return { tax };
}

export default connect(mapStateToProps)(TaxTable);
