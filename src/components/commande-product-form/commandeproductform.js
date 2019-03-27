import React, { PureComponent } from "react";
import { Card, Form, Input, Button } from "semantic-ui-react";
import styles from "./commandeproduitform.module.css";

class CommandeProductForm extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			quantite: "",
			type: this.props.type
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

	handleSumbit = (e, item, addToList, reduceToList, onClose) => {
		e.preventDefault();
		if (this.state.type === "new") {
			addToList(item._id, item.nom, item.sellPrice, this.state.quantite);
		} else reduceToList(item._id, this.state.quantite);
		onClose();
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
									<label className={styles.basicFormSpacing}>Prix de Vente</label>
									<Input disabled icon="code" iconPosition="left" value={item.sellPrice} />
								</Form.Field>
								<Form.Field>
									<label className={styles.basicFormSpacing}>Quantite dans le Reserve</label>
									<Input disabled icon="code" iconPosition="left" value={item.unit} />
								</Form.Field>
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
