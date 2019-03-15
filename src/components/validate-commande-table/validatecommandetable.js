import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal, Form, Radio, Input, Message } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Internal Components
import CommandeForm from "../commande-form/commandeform";

//Logic
import { getOrders, validateOrder } from "../../redux/actions/order";

//Styles
import styles from "./validatecommandetable.module.css";

class ValidateCommandeTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			validateModal: false,
			viewModal: false,
			errorModal: false,
			data: {},
			allProducts: [],
			currentProducts: [],
			currentPage: 1,
			totalPages: 1,
			value: "effectif",
			ammount: ""
		};

		if (isEmpty(this.props.order.orders)) {
			this.props.dispatch(getOrders());
		}
	}

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

	handleSubmit = e => {
		e.preventDefault();
		if (this.state.ammount !== "" || this.state.value === "cheque") {
			const totalDonne = this.state.value === "effectif" ? this.state.ammount : this.state.data.totalFinal;
			const valider = {
				idUser: this.props.user.authedUser._id,
				idCommande: this.state.data._id,
				typePaiement: this.state.value,
				totalDonne
			};
			return this.props.dispatch(validateOrder(valider, this.handleCloseModal));
		}
		this.setState({ errorModal: true });
	};

	handleRowClick = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		if (!e.target.classList.contains("collapsing")) {
			this.setState({ data: item, viewModal: true });
		}
	};

	handleCloseModal = () => {
		this.setState({ editModal: false, viewModal: false, validateModal: false, errorModal: false });
	};

	handleChange = (e, { value }) => this.setState({ value });

	handleInputOnChange = event => {
		const { name, value } = event.target;
		if (parseInt(value) < 0) {
			return this.setState({ [name]: 0 });
		}
		this.setState({ [name]: value });
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const estado = item.etat === "0" ? "check" : "close";
				const color = item.etat === "0" ? "green" : "red";
				const total = "$" + item.totalFinal + ".00 HTG";
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
										content="Valider"
										color="grey"
										onClick={e => {
											this.handleValidate(e, item);
										}}
									/>
								</div>
							</Table.Cell>
						</Table.Row>
					);
				} else
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
										content="Valider"
										color="green"
										onClick={e => {
											this.handleValidate(e, item);
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

	renderEffectif = value => {
		if (value === "effectif") {
			const monnaie = this.state.ammount - this.state.data.totalFinal;
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
		}
	};

	renderModal = validateModal => {
		return (
			<Modal size="small" open={validateModal} onClose={this.handleCloseModal}>
				<Modal.Header>Valider Commande</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field className={styles.centered}>
							Montant a Payer: <strong>${this.state.data.totalFinal}.00 HTG</strong>
						</Form.Field>
						<Form.Field className={styles.spacing}>
							<Radio
								label="Effectif"
								value="effectif"
								checked={this.state.value === "effectif"}
								onChange={this.handleChange}
							/>
							<Radio
								label="Cheque"
								value="cheque"
								checked={this.state.value === "cheque"}
								onChange={this.handleChange}
							/>
						</Form.Field>
						{this.renderEffectif(this.state.value)}
					</Form>
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
						onClick={this.handleSubmit}
					/>
				</Modal.Actions>
			</Modal>
		);
	};

	render() {
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.order.isFetching}>
				<Dimmer page active={this.props.order.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.viewModal} onClose={this.handleCloseModal}>
					<CommandeForm view data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
					<CommandeForm edit data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal open={this.state.errorModal} onClose={this.handleCloseModal}>
					<Message className={styles.dimmerMargin} error>
						<Message.Item className={styles.noStyleList}>
							<Icon name="warning sign" size="huge" />
						</Message.Item>
						<Message.Content content="vous devez insérer un montant" className={styles.paddingBottom} />
					</Message>
				</Modal>
				{this.renderModal(this.state.validateModal)}
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

						<Table.Body>{this.renderTableRows(this.props.order.orders)}</Table.Body>
					</Table>
					<Pagination
						defaultActivePage={1}
						ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
						firstItem={{ content: <Icon name="angle double left" />, icon: true }}
						lastItem={{ content: <Icon name="angle double right" />, icon: true }}
						prevItem={{ content: <Icon name="angle left" />, icon: true }}
						nextItem={{ content: <Icon name="angle right" />, icon: true }}
						totalPages={this.state.totalPages}
						onPageChange={this.onPageChanged}
					/>
				</div>
			</Dimmer.Dimmable>
		);
	}
}

function mapStateToProps({ order, user }) {
	return { order, user };
}

export default connect(mapStateToProps)(ValidateCommandeTable);
