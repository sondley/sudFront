import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal, Message } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Internal Components
import RegisterForm from "../register-form/registerform";

//Logic
import { getUsers, modifyUser } from "../../redux/actions/user";

//Styles
import styles from "./utilisateurtable.module.css";

class UtilisateurTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			viewModal: false,
			deleteModal: false,
			errorModal: false,
			allProducts: [],
			currentProducts: [],
			currentPage: 1,
			totalPages: 1,
			data: {}
		};
		if (isEmpty(this.props.user.users)) {
			this.props.dispatch(getUsers());
		}
	}

	handleEdit = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		console.log(item);
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
		const etat = this.state.data.etat === "1" ? "0" : "1";
		const user = { _id: this.state.data.id, etat };
		if (user._id !== this.props.user.authedUser._id) {
			return this.props.dispatch(modifyUser(user, this.handleCloseModal));
		}
		return this.setState({ errorModal: true });
	};

	handleOpenModal = (e, id, etat) => {
		e.preventDefault();
		e.stopPropagation();
		const data = { id, etat };
		this.setState({ data, deleteModal: true });
	};

	handleCloseModal = () => {
		this.setState({ editModal: false, deleteModal: false, viewModal: false, errorModal: false });
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const salaire = "$" + item.salaire + ".00 HTG";
				if (item.etat === "1") {
					return (
						<Table.Row
							key={item._id}
							onClick={e => {
								this.handleRowClick(e, item);
							}}
						>
							<Table.Cell>{item.prenom}</Table.Cell>
							<Table.Cell>{item.nom}</Table.Cell>
							<Table.Cell>{item.role}</Table.Cell>
							<Table.Cell>{item.email}</Table.Cell>
							<Table.Cell>{salaire}</Table.Cell>
							<Table.Cell collapsing>
								<div className={styles.cellSpacing}>
									<Button
										className={styles.fontSize}
										icon="edit"
										color="blue"
										onClick={e => {
											this.handleEdit(e, item);
										}}
									/>
									<Button
										className={styles.fontSize}
										content="Suspendre"
										color="red"
										onClick={e => {
											this.handleOpenModal(e, item._id, item.etat);
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
						<Table.Cell>{item.prenom}</Table.Cell>
						<Table.Cell>{item.nom}</Table.Cell>
						<Table.Cell>{item.role}</Table.Cell>
						<Table.Cell>{item.email}</Table.Cell>
						<Table.Cell>{salaire}</Table.Cell>
						<Table.Cell collapsing>
							<div className={styles.cellSpacing}>
								<Button
									disabled
									className={styles.fontSize}
									icon="edit"
									color="grey"
									onClick={e => {
										this.handleEdit(e, item);
									}}
								/>
								<Button
									className={styles.fontSize}
									content="Réembaucher"
									color="orange"
									onClick={e => {
										this.handleOpenModal(e, item._id, item.etat);
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
		const { data } = this.state;
		const title = data.etat === "1" ? "Suspendre Utilisateur" : "Réembaucher Utilisateur";
		const content =
			data.etat === "1"
				? "Es-tu sure que tu veux suspendre l'utilisateur?"
				: "Es-tu sure que tu veux réembaucher l'utilisateur?";
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.user.isFetching}>
				<Dimmer page active={this.props.user.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
					<RegisterForm edit data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal open={this.state.viewModal} onClose={this.handleCloseModal}>
					<RegisterForm view data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal open={this.state.errorModal} onClose={this.handleCloseModal}>
					<Message className={styles.dimmerMargin} error>
						<Message.Item className={styles.noStyleList}>
							<Icon name="warning sign" size="huge" />
						</Message.Item>
						<Message.Content content="Tu ne peux pas te suspendre" className={styles.paddingBottom} />
					</Message>
				</Modal>
				<Modal size="small" open={this.state.deleteModal} onClose={this.handleCloseModal}>
					<Modal.Header>{title}</Modal.Header>
					<Modal.Content>
						<p>{content}</p>
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
								<Table.HeaderCell>Prenom</Table.HeaderCell>
								<Table.HeaderCell>Nom</Table.HeaderCell>
								<Table.HeaderCell>Role</Table.HeaderCell>
								<Table.HeaderCell>Email</Table.HeaderCell>
								<Table.HeaderCell>Salaire</Table.HeaderCell>
								<Table.HeaderCell>Actions</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>{this.renderTableRows(this.props.user.users)}</Table.Body>
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

function mapStateToProps({ user }) {
	return { user };
}

export default connect(mapStateToProps)(UtilisateurTable);
