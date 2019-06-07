import React, { PureComponent } from "react";
import { Card, Form, Input, Button, Radio } from "semantic-ui-react";
import styles from "./commandeproduitform.module.css";

class CommandeProductForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			quantite: "",
			type: this.props.type,
			value: "detaille"
		};
	}

	handleChange = (e, item) => {
		e.preventDefault();
		const { name, value } = e.target;
		if (parseInt(value) > item.unit) {
			return this.setState({ [name]: item.unit });
		} else if (parseInt(value) < 0) {
			return this.setState({ [name]: 0 });
		}
		this.setState({ [name]: value * 1 });
	};

	handleRadioChange = (e, { value }) => this.setState({ value });

	handleSumbit = (e, item, addToList, reduceToList, onClose) => {
		e.preventDefault();
		if (this.state.type === "new") {
			const sellPrice =
				this.state.value === "detaille" ? item.sellPrice : this.state.quantite >= 3 ? item.grosPrice : item.caissePrice;
			addToList(item._id, item.nom, sellPrice, this.state.quantite, this.state.value);
		} else reduceToList(item._id, this.state.quantite);
		onClose();
	};

	renderForm = (value, item) => {
		if (value === "detaille") {
			return (
				<React.Fragment>
					<Form.Field>
						<label className={styles.basicFormSpacing}>Prix de Vente</label>
						<Input disabled icon="code" iconPosition="left" value={item.sellPrice} />
					</Form.Field>
					<Form.Field>
						<label className={styles.basicFormSpacing}>Quantite dans le Reserve</label>
						<Input disabled icon="code" iconPosition="left" value={item.unit} />
					</Form.Field>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<Form.Field>
						<label className={styles.basicFormSpacing}>Prix de Vente</label>
						<Input disabled icon="code" iconPosition="left" value={item.caissePrice || ""} />
					</Form.Field>
					<Form.Field>
						<label className={styles.basicFormSpacing}>Prix en Gros</label>
						<Input disabled icon="code" iconPosition="left" value={item.grosPrice || ""} />
					</Form.Field>
					<Form.Field>
						<label className={styles.basicFormSpacing}>Quantite dans le Reserve</label>
						<Input
							disabled
							icon="code"
							iconPosition="left"
							value={Math.floor(parseInt(item.unit) / parseInt(item.qtyCaisse)) || ""}
						/>
					</Form.Field>
				</React.Fragment>
			);
		}
	};

	render() {
		const { item, addToList, reduceToList, onClose } = this.props;
		return (
			<Card fluid centered className={styles.boxContainerWide}>
				<Card.Content>
					<Card.Header className="font font-18" textAlign="center">
						Choisir la Quantite
					</Card.Header>
					<div className={styles.basicFormContainer}>
						<Form className={styles.basicFormWidth}>
							<Form.Group grouped>
								<Form.Field>
									<label className={styles.basicFormSpacing}>Nom du Produit</label>
									<Input disabled icon="code" iconPosition="left" value={item.nom} />
								</Form.Field>
								<Form.Field>
									<label className={styles.basicFormSpacing}>Mode de Vente</label>
									<div className={styles.spacing}>
										<Radio
											label="Detaillé"
											value="detaille"
											checked={this.state.value === "detaille"}
											onChange={this.handleRadioChange}
										/>
										<Radio
											label="Caisse"
											value="caisse"
											checked={this.state.value === "caisse"}
											onChange={this.handleRadioChange}
										/>
									</div>
								</Form.Field>
								{this.renderForm(this.state.value, item)}
								{/* <Form.Field>
									<label className={styles.basicFormSpacing}>Prix de Vente</label>
									<Input
										disabled
										icon="code"
										iconPosition="left"
										value={this.state.value === "detaille" ? item.sellPrice : item.caissePrice || ""}
									/>
								</Form.Field>
								<Form.Field>
									<label className={styles.basicFormSpacing}>Quantite dans le Reserve</label>
									<Input
										disabled
										icon="code"
										iconPosition="left"
										value={
											this.state.value === "detaille"
												? item.unit
												: Math.floor(parseInt(item.unit) / parseInt(item.qtyCaisse)) || ""
										}
									/>
								</Form.Field> */}
								<Form.Field required>
									<label className={styles.basicFormSpacing}>Quantite</label>
									<Input
										icon="code"
										iconPosition="left"
										placeholder="Quantite"
										name="quantite"
										onChange={e => this.handleChange(e, item)}
										value={this.state.quantite}
										type="number"
									/>
								</Form.Field>
							</Form.Group>
						</Form>
					</div>
					<Button
						fluid
						size="small"
						color="teal"
						content="Ajouter le Produit dans la list"
						onClick={e => this.handleSumbit(e, item, addToList, reduceToList, onClose)}
					/>
				</Card.Content>
			</Card>
		);
	}
}

export default CommandeProductForm;
