import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Document, View, Text, Page, StyleSheet, PDFViewer } from "@react-pdf/renderer";

// const we = {
// 	client: "pierre",
// 	created: "2019-03-29T15:44:50.824Z",
// 	etat: "0",
// 	monnaie: "dollar",
// 	quantite: "10",
// 	total: 850,
// 	type: "vendre",
// 	validationDate: "2019-04-16T03:11:41.441Z",
// 	valideur: "Desvarennes  Natacha ",
// 	vendeur: "Louis Vasthy"
// };

class ReceiptMonnaie extends PureComponent {
	currencyFormat = num => {
		return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	};

	render() {
		const { client, vendeur, total, monnaie, quantite } = this.props.data;
		const prixUnite = total / parseInt(quantite);
		const width = window.innerWidth - window.innerWidth * 0.15;
		const height = window.innerHeight - window.innerHeight * 0.1;
		const today = new Date().toLocaleString("en-US");
		return (
			<PDFViewer width={width} height={height}>
				<Document title={"Receipt Change Monnaie"}>
					<Page size={[136, 842]}>
						<View style={styles.container}>
							<View style={styles.companyInfo}>
								<View>
									<Text style={{ fontSize: 10 }}>J.J Marché Grand Sud</Text>
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
								<Text style={styles.normalText}>Nom du Client: {client}</Text>
							</View>
							<View style={styles.table}>
								<View style={styles.tableHeader}>
									<Text style={[{ flex: 1, borderBottom: 0.5 }, styles.tableColumn]}>Qté</Text>
									<Text style={[{ flex: 4, borderBottom: 0.5 }, styles.tableColumn]}>Monnaie</Text>
									<Text style={[{ flex: 2, borderBottom: 0.5 }, styles.tableColumn]}>Px.Unit</Text>
									<Text style={[{ borderBottom: 0.5 }, styles.tableColumnLast]}>Montant</Text>
								</View>
							</View>
							<View style={styles.tableRows}>
								<Text style={[{ flex: 1 }, styles.endTableColumn]}>{quantite}</Text>
								<Text style={[{ flex: 4 }, styles.endTableColumn]}>{monnaie}</Text>
								<Text style={[{ flex: 2 }, styles.endTableColumn]}>{prixUnite}</Text>
								<Text style={styles.endTableColumnLast}>{this.currencyFormat(total)}</Text>
							</View>
							<View style={styles.payment}>
								<Text style={styles.bigText}>Total: {this.currencyFormat(total)} HTG</Text>
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
		fontSize: 5,
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
		fontSize: 6
	},
	bigText: {
		fontSize: 8
	},
	tableColumn: {
		fontSize: 6,
		borderRight: 0.5
	},
	tableColumnLast: {
		flex: 3,
		fontSize: 6
	},
	endTableColumn: {
		fontSize: 6,
		borderRight: 0.5,
		borderBottom: 0.5
	},
	endTableColumnLast: {
		flex: 3,
		fontSize: 6,
		borderBottom: 0.5
	},
	payment: {
		paddingTop: 5,
		flex: 1,
		textAlign: "right"
	}
});

export default connect()(ReceiptMonnaie);
