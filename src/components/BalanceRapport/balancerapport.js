import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Document, View, Text, Page, StyleSheet, PDFViewer, Image } from "@react-pdf/renderer";
import { isEmpty } from "lodash";

import Logo from "../../assets/ThuRealLogo.png";

const monthNames = [
	"Janvier",
	"Février",
	"Mars",
	"Avril",
	"Mai",
	"Juin",
	"Juillet",
	"Août",
	"Septembre",
	"Octobre",
	"Novembre",
	"Décembre"
];

const JeySon = {
	actifs: [
		{
			nom: "Encaisse",
			montant: 50000
		},
		{
			nom: "Compte a Recevoir",
			montant: 10000
		},
		{
			nom: "Fourniture",
			montant: 5000
		},
		{
			nom: "Stock de Marchandise",
			montant: 35000
		}
	],
	passifs: [
		{
			nom: "Rebo S.A",
			montant: 15000
		},
		{
			nom: "Tingue",
			montant: 10000
		}
	],
	capitaux: [
		{
			nom: "Apport",
			montant: 2200000
		},

		{
			nom: "BNR",
			montant: 500000
		},
		{
			nom: "Benefice Net",
			montant: 300000
		}
	],
	totalActif: 100000,
	totalPassif: 25000,
	totalCapitaux: 3000000
};

class BalanceReport extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
	}

	currencyFormat = num => {
		return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	};

	renderActifs = data => {
		if (!isEmpty(data)) {
			const rows = data.map((item, index) => {
				return (
					<View style={styles.tableRow} key={index}>
						<Text style={styles.tableColumnFirst}>{item.nom}</Text>
						<Text style={styles.tableColumn}> </Text>
						<Text style={styles.tableColumnLast}>{this.currencyFormat(item.montant)}</Text>
					</View>
				);
			});
			return rows;
		}
		return;
	};

	renderPassifsAndCapitaux = data => {
		if (!isEmpty(data)) {
			const rows = data.map((item, index) => {
				return (
					<View style={styles.tableRow} key={index}>
						<Text style={styles.tableColumnFirst}>{item.nom}</Text>
						<Text style={styles.tableColumn}>{this.currencyFormat(item.montant)}</Text>
						<Text style={styles.tableColumnLast}> </Text>
					</View>
				);
			});
			return rows;
		}
		return;
	};

	render() {
		const width = window.innerWidth - window.innerWidth * 0.15;
		const height = window.innerHeight - window.innerHeight * 0.1;
		const thisMonth = monthNames[new Date().getMonth()];
		const thisYear = new Date().getFullYear();
		return (
			<PDFViewer width={width} height={height}>
				<Document title={"Bilan " + thisMonth + " " + thisYear}>
					<Page size="LETTER">
						<View style={styles.container}>
							<View style={styles.company}>
								<Image src={Logo} style={styles.imageContainer} />
								<View style={styles.companyInfo}>
									<View>
										<Text style={{ fontSize: 30 }}>J.J Marché Grand Sud</Text>
									</View>
									<View>
										<Text style={{ fontSize: 16, color: "#353535" }}>Provisions Alimentaires</Text>
										<Text style={{ fontSize: 16, color: "#353535" }}>Santo, Gressier, Route Nacionale #2</Text>
										<Text style={{ fontSize: 16, color: "#353535" }}>
											Tels:(509) 3920-8302 / 4875-7333 / 4896-1104 / 4820-7590
										</Text>
									</View>
								</View>
							</View>
							<View style={styles.title}>
								<Text style={{ fontSize: 20 }}>Rapport des Bilan</Text>
								<Text style={{ fontSize: 20 }}>
									Pour l'exercice termine le 28 {thisMonth} {thisYear}
								</Text>
							</View>
							<View style={styles.table}>
								<View style={styles.tableRowTitle}>
									<Text style={styles.tableColumnFirst}>Actif a court terme</Text>
									<Text style={styles.tableColumn}> </Text>
									<Text style={styles.tableColumnLast}> </Text>
								</View>
								{this.renderActifs(JeySon.actifs)}
								<View style={styles.tableRow}>
									<Text style={styles.tableColumnFirst}>Total Actif</Text>
									<Text style={styles.tableColumn}> </Text>
									<Text style={styles.tableColumnLast}>{this.currencyFormat(JeySon.totalActif)}</Text>
								</View>
								<View style={styles.tableRowTitle}>
									<Text style={styles.tableColumnFirst}>Passif a court terme</Text>
									<Text style={styles.tableColumn}> </Text>
									<Text style={styles.tableColumnLast}> </Text>
								</View>
								{this.renderPassifsAndCapitaux(JeySon.passifs)}
								<View style={styles.tableRow}>
									<Text style={styles.tableColumnFirst}>Total Passif</Text>
									<Text style={styles.tableColumn}>{this.currencyFormat(JeySon.totalPassif)}</Text>
									<Text style={styles.tableColumnLast}> </Text>
								</View>
								<View style={styles.tableRowTitle}>
									<Text style={styles.tableColumnFirst}>Capitaux Propres</Text>
									<Text style={styles.tableColumn}> </Text>
									<Text style={styles.tableColumnLast}> </Text>
								</View>
								{this.renderPassifsAndCapitaux(JeySon.capitaux)}
								<View style={styles.tableRow}>
									<Text style={styles.endTableColumnFirst}>Total Capitaux Propres</Text>
									<Text style={styles.endTableColumn}>{this.currencyFormat(JeySon.totalCapitaux)}</Text>
									<Text style={styles.endTableColumnLast}> </Text>
								</View>
							</View>
							<View style={{ flex: 1, paddingTop: 20, textAlign: "left" }}>
								<Text>*** Toutes les valeurs sont en gourde</Text>
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
		margin: 10,
		padding: 10
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
	imageContainer: {
		width: 100,
		height: 100
	},
	title: {
		paddingTop: 45,
		paddingBottom: 25,
		textAlign: "center"
	},
	table: {
		border: 1
	},
	tableRow: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-evenly"
	},
	tableRowTitle: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-evenly",
		backgroundColor: "#BCBCBC"
	},
	tableColumnFirst: {
		padding: 2,
		flex: 4,
		borderBottom: 1,
		borderRight: 1,
		textAlign: "center",
		fontSize: 16
	},
	tableColumn: {
		padding: 2,
		flex: 3,
		borderBottom: 1,
		borderRight: 1,
		textAlign: "center",
		fontSize: 16
	},
	tableColumnLast: {
		padding: 2,
		flex: 3,
		borderBottom: 1,
		textAlign: "center",
		fontSize: 16
	},
	endTableColumnFirst: {
		padding: 2,
		flex: 4,
		borderRight: 1,
		textAlign: "center",
		fontSize: 16
	},
	endTableColumn: {
		padding: 2,
		flex: 3,
		borderRight: 1,
		textAlign: "center",
		fontSize: 16
	},
	endTableColumnLast: {
		padding: 2,
		flex: 3,
		textAlign: "center",
		fontSize: 16
	}
});

export default connect()(BalanceReport);
