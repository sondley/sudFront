import React, { PureComponent } from "react";
import { Card, Form, Input, Button, Radio } from "semantic-ui-react";
import styles from "./buyproductform.module.css";

class BuyProductForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			quantite: "",
			prixUnite: "",
			type: this.props.type,
			value: "detaille"
		};
	}

	handleChange = e => {
		e.preventDefault();
		const { name, value } = e.target;
		if (parseInt(value) < 0) {
			return this.setState({ [name]: 0 });
		}
		this.setState({ [name]: value * 1 });
	};

	handleRadioChange = (e, { value }) => this.setState({ value });

	handleSumbit = (e, item, method, onClose) => {
		e.preventDefault();
		if (this.state.type === "new") {
			method(item._id, item.nom, this.state.prixUnite, this.state.quantite, this.state.value);
			onClose();
		} else {
			method(item._id, this.state.quantite);
			onClose();
		}
	};

	render() {
		const { item, addToList, reduceToList, onClose } = this.props;
		if (this.state.type === "new") {
			return (
				<Card fluid centered className={styles.boxContainerWide}>
					<Card.Content>
						<Card.Header className="font font-18" textAlign="center">
							Choisissez la quantité et le prix
						</Card.Header>
						<div className={styles.basicFormContainer}>
							<Form className={styles.basicFormWidth}>
								<Form.Group grouped>
									<Form.Field>
										<label className={styles.basicFormSpacing}>Nom du Produit</label>
										<Input disabled icon="code" iconPosition="left" value={item.nom} />
									</Form.Field>
									<Form.Field>
										<label className={styles.basicFormSpacing}>Mode d'Achat</label>
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
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Prix Unite</label>
										<Input
											icon="money"
											iconPosition="left"
											placeholder="Prix Unite"
											name="prixUnite"
											onChange={this.handleChange}
											value={this.state.prixUnite}
											type="number"
										/>
									</Form.Field>
									<Form.Field required>
										<label className={styles.basicFormSpacing}>Quantite</label>
										<Input
											icon="code"
											iconPosition="left"
											placeholder="Quantite"
											name="quantite"
											onChange={this.handleChange}
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
							onClick={e => this.handleSumbit(e, item, addToList, onClose)}
						/>
					</Card.Content>
				</Card>
			);
		}
		return (
			<Card fluid centered className={styles.boxContainerWide}>
				<Card.Content>
					<Card.Header className="font font-18" textAlign="center">
						Choisissez la Quantité
					</Card.Header>
					<div className={styles.basicFormContainer}>
						<Form className={styles.basicFormWidth}>
							<Form.Group grouped>
								<Form.Field>
									<label className={styles.basicFormSpacing}>Nom du Produit</label>
									<Input disabled icon="code" iconPosition="left" value={item.nom} />
								</Form.Field>
								<Form.Field required>
									<label className={styles.basicFormSpacing}>Quantite</label>
									<Input
										icon="code"
										iconPosition="left"
										placeholder="Quantite"
										name="quantite"
										onChange={this.handleChange}
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
						onClick={e => this.handleSumbit(e, item, reduceToList, onClose)}
					/>
				</Card.Content>
			</Card>
		);
	}
}

export default BuyProductForm;
