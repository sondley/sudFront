import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal, Input } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Logic
import { getUsers, modifyUser } from "../../redux/actions/user";

//Styles
import styles from "./salairetable.module.css";

class SalaireTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			salaire: 0,
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

	handleSubmit = e => {
		e.preventDefault();
		const user = { _id: this.state.data.id, salaire: this.state.salaire };
		this.props.dispatch(modifyUser(user, this.handleCloseModal));
	};

	handleOpenModal = (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		const data = { id };
		this.setState({ data, editModal: true });
	};

	handleCloseModal = () => {
		this.setState({ editModal: false });
	};

	handleChange = e => {
		e.preventDefault();
		const { name, value } = e.target;
		if (parseInt(value) < 0) {
			return this.setState({ [name]: 0 });
		}
		this.setState({ [name]: value * 1 });
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const salaire = "$" + item.salaire + ".00 HTG";
				return (
					<Table.Row key={item._id}>
						<Table.Cell>{item.prenom}</Table.Cell>
						<Table.Cell>{item.nom}</Table.Cell>
						<Table.Cell>{item.role}</Table.Cell>
						<Table.Cell>{item.email}</Table.Cell>
						<Table.Cell>{salaire}</Table.Cell>
						<Table.Cell collapsing>
							<Button
								className={styles.fontSize}
								content="Augmenter Salaire"
								color="green"
								onClick={e => {
									this.handleOpenModal(e, item._id);
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
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.user.isFetching}>
				<Dimmer page active={this.props.user.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal size="small" open={this.state.editModal} onClose={this.handleCloseModal}>
					<Modal.Header>Ajouter le nouveau Salaire</Modal.Header>
					<Modal.Content>
						<Input
							icon="money"
							iconPosition="left"
							placeholder="Salaire"
							name="salaire"
							type="number"
							onChange={this.handleChange}
							value={this.state.salaire}
						/>
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

export default connect(mapStateToProps)(SalaireTable);
