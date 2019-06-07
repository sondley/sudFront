import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Document, View, Text, Page, StyleSheet, PDFViewer, Image } from "@react-pdf/renderer";
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

// const JeySon = {
// 	bnrDebut: 20000,
// 	bnrBeneficeMois: 10000,
// 	bnrFin: 30000
// };

class BNRReport extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		const { bnrDebut, bnrBeneficeMois, bnrFin } = this.props.data;
		const width = window.innerWidth - window.innerWidth * 0.15;
		const height = window.innerHeight - window.innerHeight * 0.1;
		const thisMonth = monthNames[new Date().getMonth()];
		const thisYear = new Date().getFullYear();
		return (
			<PDFViewer width={width} height={height}>
				<Document title={"Rapport BNR " + thisMonth + " " + thisYear}>
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
								<Text style={{ fontSize: 20 }}>Rapport BNR</Text>
								<Text style={{ fontSize: 20 }}>
									Pour l'exercice termine le 28 {thisMonth} {thisYear}
								</Text>
							</View>
							<View style={styles.table}>
								<View style={styles.tableRow}>
									<Text style={styles.tableLeft}>Benefice non repartis du Debut</Text>
									<Text style={styles.tableRight}>{currencyFormat(bnrDebut)} HTD</Text>
								</View>
								<View style={styles.tableRow}>
									<Text style={{ flex: 1, fontSize: 18, borderBottom: 1, paddingLeft: 2 }}>plus</Text>
								</View>
								<View style={styles.tableRow}>
									<Text style={styles.tableLeft}>
										Benefice du mois {thisMonth} {thisYear}
									</Text>
									<Text style={styles.tableRight}>{currencyFormat(bnrBeneficeMois)} HTD</Text>
								</View>
								<View style={styles.tableRow}>
									<Text style={styles.lastTableLeft}>Benefice non repartis fin</Text>
									<Text style={styles.lastTableRight}>{currencyFormat(bnrFin)} HTD</Text>
								</View>
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
		flexDirection: "row",
		justifyContent: "space-between"
	},
	tableLeft: {
		flex: 3,
		fontSize: 18,
		borderRight: 1,
		borderBottom: 1,
		paddingLeft: 2
	},
	tableRight: {
		flex: 2,
		textAlign: "right",
		fontSize: 18,
		borderBottom: 1,
		paddingRight: 2
	},
	lastTableLeft: {
		flex: 3,
		fontSize: 18,
		borderRight: 1,
		paddingLeft: 2
	},
	lastTableRight: {
		flex: 2,
		textAlign: "right",
		fontSize: 18,
		paddingRight: 2
	}
});

export default connect()(BNRReport);
