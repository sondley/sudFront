import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Document, View, Text, Page, StyleSheet, PDFViewer, Image } from "@react-pdf/renderer";
import { isEmpty } from "lodash";
import { currencyFormat } from "../../assets/utils";

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

class ResultsReport extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
	}

	renderDetails = data => {
		if (!isEmpty(data)) {
			const rows = data.map((item, index) => {
				return (
					<View style={styles.tableRow} key={index}>
						<Text style={styles.tableColumnFirst}>{item.nom}</Text>
						<Text style={styles.tableColumn}>{currencyFormat(item.montant)}</Text>
						<Text style={styles.tableColumnLast}> </Text>
					</View>
				);
			});
			return rows;
		}
		return;
	};

	render() {
		const {
			ventes,
			merchandises,
			explotation,
			totalVentes,
			totalMerchandises,
			totalExplotation,
			beneficeNet
		} = this.props.data;
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
								<Text style={{ fontSize: 20 }}>Rapport des Etat des Resultats</Text>
								<Text style={{ fontSize: 20 }}>
									Pour l'exercice termine le 28 {thisMonth} {thisYear}
								</Text>
							</View>
							<View style={styles.table}>
								<View style={styles.tableRowTitle}>
									<Text style={styles.tableColumnFirst}>Revenu des Ventes</Text>
									<Text style={styles.tableColumn}> </Text>
									<Text style={styles.tableColumnLast}> </Text>
								</View>
								{this.renderDetails(ventes)}
								<View style={styles.tableNetTitle}>
									<Text style={styles.tableColumnFirst}>Ventes Nettes</Text>
									<Text style={styles.tableColumn}> </Text>
									<Text style={styles.tableColumnLast}>{currencyFormat(totalVentes)}</Text>
								</View>
								<View style={styles.tableRowTitle}>
									<Text style={styles.tableColumnFirst}>Cout des Merchandises Vendeus</Text>
									<Text style={styles.tableColumn}> </Text>
									<Text style={styles.tableColumnLast}> </Text>
								</View>
								{this.renderDetails(merchandises)}
								<View style={styles.tableNetTitle}>
									<Text style={styles.tableColumnFirst}>Total Cout des Merchandises Vendeus</Text>
									<Text style={styles.tableColumn}> </Text>
									<Text style={styles.tableColumnLast}>{currencyFormat(totalMerchandises)}</Text>
								</View>
								<View style={styles.tableRowTitle}>
									<Text style={styles.tableColumnFirst}>Charge d'Exploitation</Text>
									<Text style={styles.tableColumn}> </Text>
									<Text style={styles.tableColumnLast}> </Text>
								</View>
								{this.renderDetails(explotation)}
								<View style={styles.tableNetTitle}>
									<Text style={styles.tableColumnFirst}>Total Charge d'Exploitation</Text>
									<Text style={styles.tableColumn}> </Text>
									<Text style={styles.tableColumnLast}>{currencyFormat(totalExplotation)}</Text>
								</View>
								<View style={styles.tableRowTitle}>
									<Text style={styles.endTableColumnFirst}>Benefice Net</Text>
									<Text style={styles.endTableColumn}> </Text>
									<Text style={styles.endTableColumnLast}>{currencyFormat(beneficeNet)}</Text>
								</View>
							</View>
							<View style={{ flex: 1, paddingTop: 20, textAlign: "left" }}>
								<Text>*** Tous les valeurs sont en gourdes</Text>
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
	tableNetTitle: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-evenly",
		backgroundColor: "#DEDEDE"
	},
	tableColumnFirst: {
		padding: 2,
		flex: 6,
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
		flex: 6,
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

export default connect()(ResultsReport);
