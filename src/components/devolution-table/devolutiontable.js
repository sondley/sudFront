import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Internal Components
import DevolutionForm from "../devolution-form/devolutionform";

//Logic
import { getDevolutions, deleteDevolution, validateDevolution } from "../../redux/actions/devolution";

//Styles
import styles from "./devolutiontable.module.css";

class DevolutionTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			viewModal: false,
			deleteModal: false,
			validateModal: false,
			allItems: [],
			currentItems: [],
			totalPages: 0,
			activePage: 1,
			pageLimit: 10,
			data: {}
		};
	}

	componentDidMount = async () => {
		await this.props.dispatch(getDevolutions());
		const allItems = this.props.devolution.devolutions;
		const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
		const currentItems = allItems.slice(0, this.state.pageLimit);
		this.setState({ allItems, currentItems, totalPages });
	};

	componentDidUpdate = () => {
		if (this.state.allItems !== this.props.devolution.devolutions) {
			const allItems = this.props.devolution.devolutions;
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

	handleValidate = (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		const data = { id };
		this.setState({ data, validateModal: true });
	};

	handleSubmit = e => {
		e.preventDefault();
		const valider = {
			idUser: this.props.user.authedUser._id,
			idDevolution: this.state.data.id
		};
		return this.props.dispatch(validateDevolution(valider, this.handleCloseModal));
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
		this.props.dispatch(deleteDevolution(this.state.data.id, this.handleCloseModal));
	};

	handleOpenModal = (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		const data = { id };
		this.setState({ data, deleteModal: true });
	};

	handleCloseModal = () => {
		this.setState({ editModal: false, deleteModal: false, viewModal: false, validateModal: false });
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const estado = item.etat === "0" ? "check" : "close";
				const color = item.etat === "0" ? "green" : "red";
				const date = new Date(item.created);
				if (item.etat === "0") {
					return (
						<Table.Row
							key={item._id}
							onClick={e => {
								this.handleRowClick(e, item);
							}}
						>
							<Table.Cell>{item.client}</Table.Cell>
							<Table.Cell>{item.realisateur}</Table.Cell>
							<Table.Cell>
								<Icon name={estado} color={color} />
							</Table.Cell>
							<Table.Cell>{item.valideur}</Table.Cell>
							<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
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
						<Table.Cell>{item.client}</Table.Cell>
						<Table.Cell>{item.realisateur}</Table.Cell>
						<Table.Cell>
							<Icon name={estado} color={color} />
						</Table.Cell>
						<Table.Cell>{"Non-Valide"}</Table.Cell>
						<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
						<Table.Cell collapsing>
							<div className={styles.cellSpacingFor3}>
								<Button
									content="Valider"
									color="green"
									onClick={e => {
										this.handleValidate(e, item._id);
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
			<Dimmer.Dimmable blurring dimmed={this.props.devolution.isFetching}>
				<Dimmer page active={this.props.devolution.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
					<DevolutionForm edit data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal open={this.state.viewModal} onClose={this.handleCloseModal}>
					<DevolutionForm view data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal size="small" open={this.state.validateModal} onClose={this.handleCloseModal}>
					<Modal.Header>Valider Devolution</Modal.Header>
					<Modal.Content>
						<p>Es-tu sure que tu veux valider la devolution?</p>
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
				<Modal size="small" open={this.state.deleteModal} onClose={this.handleCloseModal}>
					<Modal.Header>Eliminer Devolution</Modal.Header>
					<Modal.Content>
						<p>Es-tu sure que tu veux eliminer la devolution?</p>
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
								<Table.HeaderCell>Client</Table.HeaderCell>
								<Table.HeaderCell>Realisateur</Table.HeaderCell>
								<Table.HeaderCell>Etat</Table.HeaderCell>
								<Table.HeaderCell>Valideur</Table.HeaderCell>
								<Table.HeaderCell>Date</Table.HeaderCell>
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

function mapStateToProps({ devolution }) {
	return { devolution };
}

export default connect(mapStateToProps)(DevolutionTable);
