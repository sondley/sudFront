import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Internal Components
import CoinTradeForm from "../cointrade-form/cointradeform";

//Logic
import { getCoinTrades, deleteCoinTrade } from "../../redux/actions/cointrades";

//Styles
import styles from "./cointradetable.module.css";

class CoinTradeTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			deleteModal: false,
			allProducts: [],
			currentProducts: [],
			currentPage: 1,
			totalPages: 1,
			data: {}
		};
		if (isEmpty(this.props.cointrade.transactions)) {
			this.props.dispatch(getCoinTrades());
		}
	}

	handleEdit = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		this.setState({ data: item, editModal: true });
	};

	handleDelete = e => {
		e.preventDefault();
		this.props.dispatch(deleteCoinTrade(this.state.data.id, this.handleCloseModal));
	};

	handleOpenModal = (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		const data = { id };
		this.setState({ data, deleteModal: true });
	};

	handleCloseModal = () => {
		this.setState({ editModal: false, deleteModal: false });
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const estado = item.etat === "0" ? "check" : "close";
				const color = item.etat === "0" ? "green" : "red";
				const parsedtotal = "$" + item.total + ".00 HTG";
				if (item.etat === "0") {
					return (
						<Table.Row key={item._id}>
							<Table.Cell>{item.type}</Table.Cell>
							<Table.Cell>{item.client}</Table.Cell>
							<Table.Cell>{item.vendeur}</Table.Cell>
							<Table.Cell>
								<Icon name={estado} color={color} />
							</Table.Cell>
							<Table.Cell>{item.monnaie}</Table.Cell>
							<Table.Cell>{item.quantite}</Table.Cell>
							<Table.Cell>{parsedtotal}</Table.Cell>
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
				}
				return (
					<Table.Row key={item._id}>
						<Table.Cell>{item.type}</Table.Cell>
						<Table.Cell>{item.client}</Table.Cell>
						<Table.Cell>{item.vendeur}</Table.Cell>
						<Table.Cell>
							<Icon name={estado} color={color} />
						</Table.Cell>
						<Table.Cell>{item.monnaie}</Table.Cell>
						<Table.Cell>{item.quantite}</Table.Cell>
						<Table.Cell>{parsedtotal}</Table.Cell>
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
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.cointrade.isFetching}>
				<Dimmer page active={this.props.cointrade.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
					<CoinTradeForm edit data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal size="small" open={this.state.deleteModal} onClose={this.handleCloseModal}>
					<Modal.Header>Eliminer change du Monnaie</Modal.Header>
					<Modal.Content>
						<p>êtes vous sure que vous voulez l'eliminer?</p>
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
								<Table.HeaderCell>Type</Table.HeaderCell>
								<Table.HeaderCell>Nom de Client</Table.HeaderCell>
								<Table.HeaderCell>Nom de Vendeur</Table.HeaderCell>
								<Table.HeaderCell>Etat</Table.HeaderCell>
								<Table.HeaderCell>Monnaie</Table.HeaderCell>
								<Table.HeaderCell>Quantite</Table.HeaderCell>
								<Table.HeaderCell>Total</Table.HeaderCell>
								<Table.HeaderCell>Actions</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>{this.renderTableRows(this.props.cointrade.transactions)}</Table.Body>
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

function mapStateToProps({ cointrade }) {
	return { cointrade };
}

export default connect(mapStateToProps)(CoinTradeTable);
