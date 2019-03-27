import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Icon, Table, Pagination, Dimmer, Loader } from "semantic-ui-react";
import { isEmpty } from "lodash";

//Logic
import { getTransactions, getCompte } from "../../redux/actions/compte";

//Styles
import styles from "./comptetable.module.css";

class CompteTable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			editModal: false,
			allItems: [],
			currentItems: [],
			totalPages: 0,
			activePage: 1,
			pageLimit: 10,
			data: {}
		};
	}

	componentDidMount = async () => {
		const { caisse, transactions } = this.props.compte;
		if (caisse.etat === "1" || caisse.dateFermer !== "") {
			await this.props.dispatch(getCompte());
			await this.props.dispatch(getTransactions());
			const allItems = transactions;
			const totalPages = Math.ceil(allItems.length / this.state.pageLimit);
			const currentItems = allItems.slice(0, this.state.pageLimit);
			this.setState({ allItems, currentItems, totalPages });
		}
	};

	componentDidUpdate = () => {
		if (this.state.allItems !== this.props.compte.transactions) {
			const allItems = this.props.compte.transactions;
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
		const { allItems, currentItems, activePage, totalPages, pageLimit } = this.state;
		const itemRange = (activePage - 1) * pageLimit;
		const totalItems = allItems.length;
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

function mapStateToProps({ compte }) {
	return { compte };
}

export default connect(mapStateToProps)(CompteTable);
