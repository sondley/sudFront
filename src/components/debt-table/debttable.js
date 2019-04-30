import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal, Form, Input } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Logic
import { getDebtsClient, getDebtsProvider, modifyDebtClient, modifyDebtProvider } from "../../redux/actions/debt";

//Styles
import styles from "./debttable.module.css";

class DebtTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			type: this.props.type,
			salaire: 0,
			allItems: [],
			currentItems: [],
			totalPages: 0,
			activePage: 1,
			pageLimit: 10,
			montant: "",
			data: {}
		};
	}

	componentDidMount = async () => {
		let allItems = [];
		if (this.state.type === "payer") {
			await this.props.dispatch(getDebtsProvider());
			allItems = this.props.debt.debtProvider;
		} else {
			await this.props.dispatch(getDebtsClient());
			allItems = this.props.debt.debtClient;
		}
		const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
		const currentItems = allItems.slice(0, this.state.pageLimit);
		this.setState({ allItems, currentItems, totalPages });
	};

	componentDidUpdate = () => {
		if (this.state.type === "payer") {
			if (this.state.allItems !== this.props.debt.debtProvider) {
				const allItems = this.props.debt.debtProvider;
				const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
				const currentItems = allItems.slice(0, this.state.pageLimit);
				this.setState({ allItems, currentItems, totalPages });
			}
		} else {
			if (this.state.allItems !== this.props.debt.debtClient) {
				const allItems = this.props.debt.debtClient;
				const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
				const currentItems = allItems.slice(0, this.state.pageLimit);
				this.setState({ allItems, currentItems, totalPages });
			}
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

	handleSubmit = e => {
		e.preventDefault();
		const item = {
			idDette: this.state.data._id,
			quantite: this.state.montant
		};
		if (this.state.type === "payer") {
			return this.props.dispatch(modifyDebtProvider(item, this.handleCloseModal));
		}
		return this.props.dispatch(modifyDebtClient(item, this.handleCloseModal));
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	handleOpenModal = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		this.setState({ data: item, editModal: true });
	};

	handleCloseModal = () => {
		this.setState({ editModal: false });
	};

	handleChange = (e, { value }) => this.setState({ value });

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const salaire = "$" + item.quantite + ".00 HTD";
				if (this.state.type === "payer") {
					return (
						<Table.Row key={item._id} negative>
							<Table.Cell>{item.nomProvider}</Table.Cell>
							<Table.Cell>{salaire}</Table.Cell>
							<Table.Cell collapsing>
								<Button
									className={styles.fontSize}
									content="Realiser Paiement"
									color="orange"
									onClick={e => {
										this.handleOpenModal(e, item);
									}}
								/>
							</Table.Cell>
						</Table.Row>
					);
				}
				return (
					<Table.Row key={item._id} positive>
						<Table.Cell>{item.nomClient}</Table.Cell>
						<Table.Cell>{salaire}</Table.Cell>
						<Table.Cell collapsing>
							<Button
								className={styles.fontSize}
								content="Recevoir Paiement"
								color="green"
								onClick={e => {
									this.handleOpenModal(e, item);
								}}
							/>
						</Table.Cell>
					</Table.Row>
				);
			});
			return rows;
		}
		return;
	};

	render() {
		const { allItems, currentItems, activePage, totalPages, pageLimit, type, data } = this.state;
		const itemRange = (activePage - 1) * pageLimit;
		const totalItems = allItems.length;
		const message =
			type === "payer"
				? "Montant a Payer: $" + data.quantite + ".00 HTD"
				: "Montant a Recevoir: $" + data.quantite + ".00 HTD";

		if (type === "payer") {
			return (
				<Dimmer.Dimmable blurring dimmed={this.props.debt.isFetching}>
					<Dimmer page active={this.props.debt.isFetching}>
						<Loader size="huge">Loading...</Loader>
					</Dimmer>
					<Modal size="small" open={this.state.editModal} onClose={this.handleCloseModal}>
						<Modal.Header>Realiser Paiement</Modal.Header>
						<Modal.Content>
							<Form>
								<Form.Field>{message}</Form.Field>
								<Form.Field required>
									<label className={styles.basicFormSpacing}>Montant</label>
									<Input
										icon="money"
										iconPosition="left"
										placeholder="Montant"
										name="montant"
										type="number"
										onChange={this.handleInputOnChange}
										value={this.state.montant}
									/>
								</Form.Field>
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
					<div>
						<Table selectable compact celled striped size="small">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Fournisseur</Table.HeaderCell>
									<Table.HeaderCell>Montant</Table.HeaderCell>
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
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.debt.isFetching}>
				<Dimmer page active={this.props.debt.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal size="small" open={this.state.editModal} onClose={this.handleCloseModal}>
					<Modal.Header>Realiser Paiement</Modal.Header>
					<Modal.Content>
						<Form>
							<Form.Field>{message}</Form.Field>
							<Form.Field required>
								<label className={styles.basicFormSpacing}>Montant</label>
								<Input
									icon="money"
									iconPosition="left"
									placeholder="Montant"
									name="montant"
									type="number"
									onChange={this.handleInputOnChange}
									value={this.state.montant}
								/>
							</Form.Field>
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
				<div>
					<Table selectable compact celled striped size="small">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Client</Table.HeaderCell>
								<Table.HeaderCell>Montant</Table.HeaderCell>
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

function mapStateToProps({ debt, user }) {
	return { debt, user };
}

export default connect(mapStateToProps)(DebtTable);
