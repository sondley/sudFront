import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Internal Components
import TauxForm from "../taux-form/tauxform";

//Logic
import { getTauxs } from "../../redux/actions/taux";

class TauxTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			allProducts: [],
			currentProducts: [],
			currentPage: 1,
			totalPages: 1,
			data: {}
		};
		if (isEmpty(this.props.taux.monnaies)) {
			this.props.dispatch(getTauxs());
		}
	}

	handleEdit = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		this.setState({ data: item, editModal: true });
	};

	handleCloseModal = () => {
		this.setState({ editModal: false });
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const vente = "$" + item.prixVente + " HTG";
				const achat = "$" + item.prixAchat + " HTG";
				return (
					<Table.Row key={item._id}>
						<Table.Cell>{item.nom}</Table.Cell>
						<Table.Cell>{vente}</Table.Cell>
						<Table.Cell>{achat}</Table.Cell>
						<Table.Cell collapsing>
							<Button
								icon="edit"
								color="blue"
								onClick={e => {
									this.handleEdit(e, item);
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
			<Dimmer.Dimmable blurring dimmed={this.props.taux.isFetching}>
				<Dimmer page active={this.props.taux.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
					<TauxForm edit data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<div>
					<Table selectable compact celled striped size="small">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Nom</Table.HeaderCell>
								<Table.HeaderCell>Prix de Vente</Table.HeaderCell>
								<Table.HeaderCell>Prix d'Achat</Table.HeaderCell>
								<Table.HeaderCell>Actions</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>{this.renderTableRows(this.props.taux.monnaies)}</Table.Body>
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

function mapStateToProps({ taux }) {
	return { taux };
}

export default connect(mapStateToProps)(TauxTable);
