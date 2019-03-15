import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Pagination, Dimmer, Loader, Modal } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Internal Components
import ProviderForm from "../provider-form/providerform";

//Logic
import { getProviders } from "../../redux/actions/provider";

class ProviderTable extends PureComponent {
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
		if (isEmpty(this.props.provider.providers)) {
			this.props.dispatch(getProviders());
		}
	}

	handleEdit = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		this.setState({ data: item, editModal: true, viewModal: false });
	};

	handleRowClick = (e, item) => {
		e.preventDefault();
		e.stopPropagation();
		if (!e.target.classList.contains("collapsing")) {
			this.setState({ data: item, viewModal: true, editModal: false });
		}
	};

	handleCloseModal = () => {
		this.setState({ editModal: false, deleteModal: false, viewModal: false, errorModal: false });
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				return (
					<Table.Row
						key={item._id}
						onClick={e => {
							this.handleRowClick(e, item);
						}}
					>
						<Table.Cell>{item.nom}</Table.Cell>
						<Table.Cell>{item.tel}</Table.Cell>
						<Table.Cell>{item.email}</Table.Cell>
						<Table.Cell>{item.addresse}</Table.Cell>
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
			<Dimmer.Dimmable blurring dimmed={this.props.provider.isFetching}>
				<Dimmer page active={this.props.provider.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<Modal open={this.state.editModal} onClose={this.handleCloseModal}>
					<ProviderForm edit data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<Modal open={this.state.viewModal} onClose={this.handleCloseModal}>
					<ProviderForm view data={this.state.data} onClose={this.handleCloseModal} />
				</Modal>
				<div>
					<Table selectable compact celled striped size="small">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Nom</Table.HeaderCell>
								<Table.HeaderCell>Tel</Table.HeaderCell>
								<Table.HeaderCell>Email</Table.HeaderCell>
								<Table.HeaderCell>Addresse</Table.HeaderCell>
								<Table.HeaderCell>Actions</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>{this.renderTableRows(this.props.provider.providers)}</Table.Body>
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

function mapStateToProps({ provider }) {
	return { provider };
}

export default connect(mapStateToProps)(ProviderTable);
