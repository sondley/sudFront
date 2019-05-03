import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal, Form } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Logic
import { getPayments, createPayment } from "../../redux/actions/payment";

//Styles
import styles from "./paiementtable.module.css";

class PaiementTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			salaire: 0,
			allItems: [],
			currentItems: [],
			totalPages: 0,
			activePage: 1,
			pageLimit: 10,
			value: "caisse",
			data: {}
		};
	}

	componentDidMount = async () => {
		await this.props.dispatch(getPayments());
		const allItems = this.props.payment.payments;
		const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
		const currentItems = allItems.slice(0, this.state.pageLimit);
		this.setState({ allItems, currentItems, totalPages });
	};

	componentDidUpdate = () => {
		if (this.state.allItems !== this.props.payment.payments) {
			const allItems = this.props.payment.payments;
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

	handleSubmit = e => {
		e.preventDefault();
		const item = {
			idRealisateur: this.props.user.authedUser._id
		};
		this.props.dispatch(createPayment(item, this.handleCloseModal));
	};

	handleOpenModal = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		const data = item;
		this.setState({ data, editModal: true });
	};

	handleCloseModal = () => {
		this.setState({ editModal: false });
	};

	handleChange = (e, { value }) => this.setState({ value });

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const estado = item.etat === "0" ? "check" : "close";
				const color = item.etat === "0" ? "green" : "red";
				const total = "$" + item.total + ".00 HTD";
				const date = new Date(item.created);
				if (item.etat === "1") {
					return (
						<Table.Row key={item._id}>
							<Table.Cell>{total}</Table.Cell>
							<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
							<Table.Cell>
								<Icon name={estado} color={color} />
							</Table.Cell>
							<Table.Cell>{"Non-Realiser"}</Table.Cell>
							<Table.Cell collapsing>
								<Button
									className={styles.fontSize}
									content="Realiser Paiement"
									color="green"
									onClick={e => {
										this.handleOpenModal(e, item);
									}}
								/>
							</Table.Cell>
						</Table.Row>
					);
				}
				return (
					<Table.Row key={item._id}>
						<Table.Cell>{total}</Table.Cell>
						<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
						<Table.Cell>
							<Icon name={estado} color={color} />
						</Table.Cell>
						<Table.Cell>{item.realisateur}</Table.Cell>
						<Table.Cell collapsing disabled>
							<Button className={styles.fontSize} content="Realiser Paiement" color="grey" />
						</Table.Cell>
					</Table.Row>
				);
			});
			return rows;
		}
		return;
	};

	renderConfirmTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const total = "$" + item.montant + ".00 HTD";
				return (
					<Table.Row key={item._id}>
						<Table.Cell>{item.nom}</Table.Cell>
						<Table.Cell>{total}</Table.Cell>
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
			<Dimmer.Dimmable blurring dimmed={this.props.user.isFetching}>
				<Dimmer page active={this.props.user.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal size="small" open={this.state.editModal} onClose={this.handleCloseModal}>
					<Modal.Header>Realiser Paiement</Modal.Header>
					<Modal.Content>
						<Form>
							<Table selectable compact celled striped size="small">
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>Nom de Employee</Table.HeaderCell>
										<Table.HeaderCell>Montant</Table.HeaderCell>
									</Table.Row>
								</Table.Header>
								<Table.Body>{this.renderConfirmTableRows(this.state.data.arrayPaiement)}</Table.Body>
							</Table>
							<Form.Field className={styles.centered}>d'où voulez-vous payer?</Form.Field>
							<Form.Field className={styles.centered}>
								{"Vous venez d'effectuer un retrait de "}
								<div className={styles.bold}>${this.state.data.total}.00 HTD</div>
								{"dans le coffre"}
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
								<Table.HeaderCell>Montant</Table.HeaderCell>
								<Table.HeaderCell>Date</Table.HeaderCell>
								<Table.HeaderCell>Etat</Table.HeaderCell>
								<Table.HeaderCell>Realisateur</Table.HeaderCell>
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

function mapStateToProps({ payment, user }) {
	return { payment, user };
}

export default connect(mapStateToProps)(PaiementTable);
