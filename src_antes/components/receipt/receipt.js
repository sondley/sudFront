import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Document, View, Text, Page, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { isEmpty } from "lodash";

class Receipt extends PureComponent {
	currencyFormat = num => {
		return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	};

	renderTableRows = data => {
		if (!isEmpty(data)) {
			const rows = data.map((item, index) => {
				if (index < data.length - 1) {
					return (
						<View style={styles.tableRows} key={item._id}>
							<Text style={[{ flex: 1 }, styles.tableColumn]}>{item.quantite}</Text>
							<Text style={[{ flex: 4 }, styles.tableColumn]}>{item.nom}</Text>
							<Text style={[{ flex: 2 }, styles.tableColumn]}>{item.prixUnite}</Text>
							<Text style={styles.tableColumnLast}>{this.currencyFormat(item.total)}</Text>
						</View>
					);
				}
				return (
					<View style={styles.tableRows} key={item._id}>
						<Text style={[{ flex: 1 }, styles.endTableColumn]}>{item.quantite}</Text>
						<Text style={[{ flex: 4 }, styles.endTableColumn]}>{item.nom}</Text>
						<Text style={[{ flex: 2 }, styles.endTableColumn]}>{item.prixUnite}</Text>
						<Text style={styles.endTableColumnLast}>{this.currencyFormat(item.total)}</Text>
					</View>
				);
			});
			return rows;
		}
		return;
	};

	render() {
		const { rabais } = this.props;
		const { numero, arrayOrden, client, vendeur, totalFinal, totalDonne } = this.props.data;
		const total = totalFinal - parseInt(rabais);
		const changement = totalDonne - total > 0 ? totalDonne - total : 0;
		const width = window.innerWidth - window.innerWidth * 0.15;
		const height = window.innerHeight - window.innerHeight * 0.1;
		const today = new Date().toLocaleString("en-US");
		return (
			<PDFViewer width={width} height={height}>
				<Document title={"Receipt " + numero}>
					<Page size={[180, 842]}>
						<View style={styles.container}>
							<View style={styles.companyInfo}>
								<View>
									<Text style={{ fontSize: 14 }}>J.J Marché Grand Sud</Text>
								</View>
								<View>
									<Text style={styles.companyInfoText}>Provisions Alimentaires</Text>
									<Text style={styles.companyInfoText}>Santo, Gressier, Route Nacionale #2</Text>
									<Text style={styles.companyInfoText}>Tels:(509) 3920-8302 / 4875-7333 / 4896-1104 / 4820-7590</Text>
								</View>
							</View>
							<View style={styles.title}>
								<Text style={styles.bigText}>Fiche de Vente</Text>
							</View>
							<View style={{ paddingBottom: 5 }}>
								<Text style={styles.normalText}>Date: {today}</Text>
								<Text style={styles.normalText}>Vendeur: {vendeur}</Text>
								<Text style={styles.normalText}>Livraison: {numero}</Text>
								<Text style={styles.normalText}>Nom du Client: {client}</Text>
							</View>
							<View style={styles.table}>
								<View style={styles.tableHeader}>
									<Text style={[{ flex: 1, borderBottom: 0.5 }, styles.tableColumn]}>Qté</Text>
									<Text style={[{ flex: 4, borderBottom: 0.5 }, styles.tableColumn]}>Description</Text>
									<Text style={[{ flex: 2, borderBottom: 0.5 }, styles.tableColumn]}>Px.Unit</Text>
									<Text style={[{ borderBottom: 0.5 }, styles.tableColumnLast]}>Montant</Text>
								</View>
								{this.renderTableRows(arrayOrden)}
							</View>
							<View style={styles.payment}>
								<Text style={styles.normalText}>SubTotal: {this.currencyFormat(totalFinal)} HTD</Text>
								<Text style={styles.normalText}>Rabais: {this.currencyFormat(parseInt(rabais))} HTD</Text>
								<Text style={[styles.normalText, { borderTop: 0.2 }]}>Total: {this.currencyFormat(total)} HTD</Text>
							</View>
							<View style={[styles.payment, { paddingTop: 5 }]}>
								<Text style={styles.normalText}>Total Donné: {this.currencyFormat(totalDonne)} HTD</Text>
								<Text style={styles.normalText}>Remise: {this.currencyFormat(changement)} HTD</Text>
							</View>
							<View style={{ flex: 1, paddingTop: 10 }}>
								<Text style={styles.normalText}>
									Verifye Machandiz la Byen avan ou ale, nou pap aksepte okenn retou
								</Text>
							</View>
						</View>
					</Page>
				</Document>
			</PDFViewer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 2
	},
	company: {
		flexDirection: "row",
		height: 100
	},
	companyInfo: {
		display: "flex",
		flexDirection: "column",
		textAlign: "center",
		justifyContent: "space-between",
		flex: 1
	},
	companyInfoText: {
		fontSize: 6,
		color: "#353535"
	},
	imageContainer: {
		width: 100,
		height: 100
	},
	title: {
		paddingTop: 10,
		paddingBottom: 5,
		textAlign: "center"
	},
	table: {
		flex: 1
	},
	tableHeader: {
		flexDirection: "row",
		textAlign: "center",
		paddingBottom: 2
	},
	tableRows: {
		flexDirection: "row",
		textAlign: "center"
	},
	normalText: {
		fontSize: 9
	},
	bigText: {
		fontSize: 11
	},
	tableColumn: {
		fontSize: 9,
		borderRight: 0.5
	},
	tableColumnLast: {
		flex: 3,
		fontSize: 9
	},
	endTableColumn: {
		fontSize: 9,
		borderRight: 0.5,
		borderBottom: 0.5
	},
	endTableColumnLast: {
		flex: 3,
		fontSize: 9,
		borderBottom: 0.5
	},
	payment: {
		paddingTop: 5,
		flex: 1,
		textAlign: "right"
	}
});

export default connect()(Receipt);
