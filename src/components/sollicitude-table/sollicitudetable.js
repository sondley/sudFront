import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal, Message, Form, Input } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Internal Components
import SollicitudeForm from "../sollicitude-form/sollicitudeform";

//Logic
import { getSollicitudes, deleteSollicitude, validateSollicitude } from "../../redux/actions/sollicitude";
import { getCompte } from "../../redux/actions/compte";

//Styles
import styles from "./sollicitudetable.module.css";

class TauxTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			viewModal: false,
			validateModal: false,
			deleteModal: false,
			allItems: [],
			currentItems: [],
			totalPages: 0,
			activePage: 1,
			pageLimit: 10,
			data: {},
			totalValider: ""
		};
	}

	componentDidMount = async () => {
		await this.props.dispatch(getSollicitudes());
		const allItems = this.props.sollicitude.sollicitudes;
		const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
		const currentItems = allItems.slice(0, this.state.pageLimit);
		this.setState({ allItems, currentItems, totalPages });
	};

	componentDidUpdate = () => {
		if (this.state.allItems !== this.props.sollicitude.sollicitudes) {
			const allItems = this.props.sollicitude.sollicitudes;
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

	handleValidate = async (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		await this.props.dispatch(getCompte());
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
		this.props.dispatch(deleteSollicitude(this.state.data.id, this.handleCloseModal));
	};

	handleOpenModal = (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		const data = { id };
		this.setState({ data, deleteModal: true });
	};

	handleCloseModal = () => {
		this.setState({ editModal: false, deleteModal: false, viewModal: false, errorModal: false, validateModal: false });
	};

	handleSubmit = e => {
		e.preventDefault();
		if (this.state.totalValider !== "") {
			const valider = {
				idUser: this.props.user.authedUser._id,
				idSollicitude: this.state.data._id,
				totalValider: this.state.totalValider
			};
			return this.props.dispatch(validateSollicitude(valider, this.handleCloseModal));
		}
		this.setState({ errorModal: true });
	};

	handleInputOnChange = event => {
		const { name, value } = event.target;
		if (parseInt(value) < 0) {
			return this.setState({ [name]: 0 });
		} else if (parseInt(value) > parseInt(this.props.compte.moneyCompte)) {
			return this.setState({ [name]: parseInt(this.props.compte.moneyCompte) });
		} else if (
			parseInt(value) > parseInt(this.state.data.quantite) &&
			parseInt(value) < parseInt(this.props.compte.moneyCompte)
		) {
			return this.setState({ [name]: parseInt(this.state.data.quantite) });
		} else {
			return this.setState({ [name]: parseInt(value) });
		}
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const estado = item.etat === "0" ? "check" : "close";
				const color = item.etat === "0" ? "green" : "red";
				const total = "$" + item.quantite + ".00 HTD";
				const date = new Date(item.created);
				if (this.props.user.authedUser.role === "caissier") {
					if (item.etat === "0") {
						return (
							<Table.Row
								key={item._id}
								onClick={e => {
									this.handleRowClick(e, item);
								}}
							>
								<Table.Cell>{item.solliciteur}</Table.Cell>
								<Table.Cell>
									<Icon name={estado} color={color} />
								</Table.Cell>
								<Table.Cell>{item.valideur}</Table.Cell>
								<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
								<Table.Cell>{total}</Table.Cell>
								<Table.Cell>{item.description}</Table.Cell>
								<Table.Cell collapsing disabled>
									<div className={styles.cellSpacingFor2}>
										<Button icon="edit" color="grey" />
										<Button content="Valider" color="grey" />
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
							<Table.Cell>{item.solliciteur}</Table.Cell>
							<Table.Cell>
								<Icon name={estado} color={color} />
							</Table.Cell>
							<Table.Cell>{"Non-Valide"}</Table.Cell>
							<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
							<Table.Cell>{total}</Table.Cell>
							<Table.Cell>{item.description}</Table.Cell>
							<Table.Cell collapsing>
								<div className={styles.cellSpacingFor2}>
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
				}
				if (item.etat === "0") {
					return (
						<Table.Row
							key={item._id}
							onClick={e => {
								this.handleRowClick(e, item);
							}}
						>
							<Table.Cell>{item.solliciteur}</Table.Cell>
							<Table.Cell>
								<Icon name={estado} color={color} />
							</Table.Cell>
							<Table.Cell>{item.valideur}</Table.Cell>
							<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
							<Table.Cell>{total}</Table.Cell>
							<Table.Cell>{item.description}</Table.Cell>
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
						<Table.Cell>{item.solliciteur}</Table.Cell>
						<Table.Cell>
							<Icon name={estado} color={color} />
						</Table.Cell>
						<Table.Cell>{"Non-Valide"}</Table.Cell>
						<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
						<Table.Cell>{total}</Table.Cell>
						<Table.Cell>{item.description}</Table.Cell>
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

	renderModal = validateModal => {
		return (
			<Modal size="small" open={validateModal} onClose={this.handleCloseModal}>
				<Modal.Header>Valider Sollicitude</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field>
							<label>Argent Disponible: ${this.props.compte.moneyCompte}.00 HTD</label>
						</Form.Field>
						<Form.Field>
							<label>Montant Demandé: ${this.state.data.quantite}.00 HTD</label>
						</Form.Field>
						<Form.Field required>
							<label className={styles.basicFormSpacing}>Montant</label>
							<Input
								icon="money"
								iconPosition="left"
								placeholder="Montant"
								name="totalValider"
								type="number"
								onChange={this.handleInputOnChange}
								value={this.state.totalValider}
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
		);
	};

	render() {
		const { allItems, currentItems, activePage, totalPages, pageLimit } = this.state;
		const itemRange = (activePage - 1) * pageLimit;
		const totalItems = allItems.length;
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.sollicitude.isFetching}>
				<Dimmer page active={this.props.sollicitude.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.errorModal} onClose={this.handleCloseModal}>
					<Message className={styles.dimmerMargin} error>
						<Message.Item className={styles.noStyleList}>
							<Icon name="warning sign" size="huge" />
						</Message.Item>
						<Message.Content content="le champs du montant ne peut pas etre vide" className={styles.paddingBottom} />
					</Message>
				</Modal>
				{this.renderModal(this.state.validateModal)}
				<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
					<SollicitudeForm edit data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal open={this.state.viewModal} onClose={this.handleCloseModal}>
					<SollicitudeForm view data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal size="small" open={this.state.deleteModal} onClose={this.handleCloseModal}>
					<Modal.Header>Eliminer Sollicitude</Modal.Header>
					<Modal.Content>
						<p>Es-tu sure que tu veux eliminer la sollicitude?</p>
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
								<Table.HeaderCell>Nom du Solliciteur</Table.HeaderCell>
								<Table.HeaderCell>Etat</Table.HeaderCell>
								<Table.HeaderCell>Nom du Valideur</Table.HeaderCell>
								<Table.HeaderCell>Date</Table.HeaderCell>
								<Table.HeaderCell>Montant</Table.HeaderCell>
								<Table.HeaderCell>Description</Table.HeaderCell>
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

function mapStateToProps({ sollicitude, user, compte }) {
	return { sollicitude, user, compte };
}

export default connect(mapStateToProps)(TauxTable);
