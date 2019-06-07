import React, { PureComponent } from "react";
import { Feed, Icon, Header } from "semantic-ui-react";
import ReactTimeAgo from "react-time-ago/no-tooltip";

import styles from "./notifications.module.css";

class Notifications extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { nomProduit, created, limit, value } = this.props.data;
		const date = new Date(created);
		return (
			<div className={styles.notificationContainer}>
				<Feed size="small">
					<div className={styles.notificationCounterContainer}>
						<Header as="h6" className={styles.notificationHeader}>
							<Icon color="orange" name="warning circle" className={styles.notificationHeader} />
							Produit en dessous de la limite: {nomProduit}
						</Header>
					</div>
					<Feed.Event className={styles.notificationEvent}>
						<Feed.Content>
							<div className={styles.notificationAlignContent}>
								<Icon name="mail" style={{ marginRight: "10px" }} />
								<Feed.Extra text>
									Vous devez ajouter au stock de <span style={{ fontWeight: "700" }}>{nomProduit}</span> Car il Vous
									Reste <span style={{ fontWeight: "700", color: "red" }}>{value}</span> Vous avez mis une limite de{" "}
									<span style={{ fontWeight: "700", color: "green" }}>{limit}</span>
								</Feed.Extra>
							</div>
							<Feed.Date
								className={styles.notificationTimeStyle}
								content={<ReactTimeAgo timeStyle="time" date={date} />}
							/>
						</Feed.Content>
					</Feed.Event>
				</Feed>
			</div>
		);
	}
}

export default Notifications;
