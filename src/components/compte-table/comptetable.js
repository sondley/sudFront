import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Icon, Table, Pagination, Dimmer, Loader } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Logic
import { getTransactions, getCompte } from "../../redux/actions/compte";

class CompteTable extends PureComponent {
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
	}

	async componentDidMount() {
		await this.props.dispatch(getTransactions());
		await this.props.dispatch(getCompte());
	}

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map(item => {
				const montant = "$" + item.montant + ".00 HTG";
				const date = new Date(item.created);
				if (item.flux === "Rentree") {
					return (
						<Table.Row key={item._id} positive>
							<Table.Cell>{item.type}</Table.Cell>
							<Table.Cell>{item.flux}</Table.Cell>
							<Table.Cell>{item.realisateur}</Table.Cell>
							<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
							<Table.Cell>{montant}</Table.Cell>
						</Table.Row>
					);
				} else {
					return (
						<Table.Row key={item._id} negative>
							<Table.Cell>{item.type}</Table.Cell>
							<Table.Cell>{item.flux}</Table.Cell>
							<Table.Cell>{item.realisateur}</Table.Cell>
							<Table.Cell>{date.toLocaleString("en-US")}</Table.Cell>
							<Table.Cell>{montant}</Table.Cell>
						</Table.Row>
					);
				}
			});
			return rows;
		}
		return;
	};

	render() {
		return (
			<Dimmer.Dimmable blurring dimmed={this.props.compte.isFetching}>
				<Dimmer page active={this.props.compte.isFetching}>
					<Loader size="huge">Loading...</Loader>
				</Dimmer>
				<div>
					<Table selectable compact celled striped size="small">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Type</Table.HeaderCell>
								<Table.HeaderCell>Flux</Table.HeaderCell>
								<Table.HeaderCell>Realisateur</Table.HeaderCell>
								<Table.HeaderCell>Date</Table.HeaderCell>
								<Table.HeaderCell>Montant</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>{this.renderTableRows(this.props.compte.transactions)}</Table.Body>
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

function mapStateToProps({ compte }) {
	return { compte };
}

export default connect(mapStateToProps)(CompteTable);
