import api from "../../api";
import Cookie from "react-cookies";
import decode from "jwt-decode";

export const LOGOUT = "LOGOUT";
export const LOGIN = "LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGGED_USER = "LOGGED_USER";
export const LOGGED_USER_SUCCESS = "LOGGED_USER_SUCCESS";
export const LOGGED_USER_FAIL = "LOGGED_USER_FAIL";
export const REFRESH_TOKEN = "REFRESH_TOKEN";
export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";
export const REFRESH_TOKEN_FAIL = "REFRESH_TOKEN_FAIL";
export const GET_USERS = "GET_USERS";
export const GET_USERS_SUCCESS = "GET_USERS_SUCCESS";
export const GET_USERS_FAIL = "GET_USERS_FAIL";
export const CREATE_USER = "CREATE_USER";
export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAIL = "CREATE_USER_FAIL";
export const MODIFY_USER = "MODIFY_USER";
export const MODIFY_USER_SUCCESS = "MODIFY_USER_SUCCESS";
export const MODIFY_USER_FAIL = "MODIFY_USER_FAIL";
export const DELETE_USER = "DELETE_USER";
export const DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS";
export const DELETE_USER_FAIL = "DELETE_USER_FAIL";

function requestBegin(type) {
	return { type };
}

function requestSuccess(type, user, message, token) {
	return { type, payload: { user, message, token } };
}

function requestFail(type, message) {
	return { type, payload: { message } };
}

function requestSuccessWithNavTree(type, user, message, token, navTree) {
	return { type, payload: { user, message, token, navTree } };
}

export function logout() {
	return dispatch => {
		Cookie.remove("sessionCookie");
		return dispatch(requestBegin(LOGOUT));
	};
}

export function login(username, password, rememberMe) {
	return dispatch => {
		dispatch(requestBegin(LOGIN));
		return api
			.requestPOST("/authenticate", {
				email: username,
				motDePasse: password
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					const { user, token } = objResponse.data.data;
					let Options = [];
					switch (user.role) {
						case "vendeur":
							Options = [
								{
									name: "/orders",
									icon: "clipboard list",
									label: "Commande",
									index: 0
								},
								{
									name: "/products",
									icon: "box",
									label: "Produits",
									index: 1
								},
								{
									name: "/trade_coin",
									icon: "money",
									label: "Monnaie",
									index: 2
								},
								{
									name: "/vendor_reports",
									icon: "chart bar outline",
									label: "Rapports",
									index: 3
								}
							];
							break;
						case "caissier":
							Options = [
								{
									name: "/validate_solicitude",
									icon: "check square",
									label: "Valider Sollicitude",
									index: 0
								},
								{
									name: "/validate_order",
									icon: "clipboard check",
									label: "Valider Commande",
									index: 1
								},
								{
									name: "/validate_tradecoin",
									icon: "check circle",
									label: "Valider Changement Monnaie",
									index: 2
								},
								{
									name: "/view_transactions",
									icon: "handshake outline",
									label: "Voir Transactions",
									index: 3
								}
							];
							break;
						case "directeur":
							Options = [
								{
									name: "/director_reports",
									icon: "chart line",
									label: "Rapports",
									index: 0
								},
								{
									name: "/users",
									icon: "users",
									label: "Utilisateurs",
									index: 1
								},
								{
									name: "/salary",
									icon: "money bill alternate outline",
									label: "Augmenter le Salaire",
									index: 2
								},
								{
									name: "/cash_status",
									icon: "money",
									label: "Etat du Compte",
									index: 3
								},
								{
									name: "/buys",
									icon: "cart",
									label: "Reviser Achats",
									index: 4
								},
								{
									name: "/sales",
									icon: "tags",
									label: "Reviser Ventes",
									index: 5
								},
								{
									name: "/solicitude",
									icon: "hand lizard outline",
									label: "Sollicitude",
									index: 6
								},
								{
									name: "/warehouse",
									icon: "archive",
									label: "Stock",
									index: 7
								},
								{
									name: "/exchange_rate",
									icon: "sync",
									label: "Taux de Change",
									index: 8
								},
								{
									name: "/devolution",
									icon: "sync",
									label: "Devolution du Produit",
									index: 9
								},
								{
									name: "/comite_monitor",
									icon: "sign-in",
									label: "Rentrez de Comite",
									index: 10
								}
							];
							break;
						case "comite":
							Options = [
								{
									name: "/comite_reports",
									icon: "chart line",
									label: "Rapports",
									index: 0
								},
								{
									name: "/cash_status",
									icon: "money",
									label: "Etat du Compte",
									index: 1
								},
								{
									name: "/buys",
									icon: "cart",
									label: "Reviser Achats",
									index: 2
								},
								{
									name: "/sales",
									icon: "tags",
									label: "Reviser Ventes",
									index: 3
								},
								{
									name: "/warehouse",
									icon: "archive",
									label: "Stock",
									index: 4
								}
							];
							break;
						case "contable":
							Options = [
								{
									name: "/cash_status",
									icon: "money",
									label: "Etat du Compte",
									index: 0
								},
								{
									name: "/buys",
									icon: "cart",
									label: "Achats",
									index: 1
								},
								{
									name: "/sales",
									icon: "tags",
									label: "Ventes",
									index: 2
								},
								{
									name: "/payment",
									icon: "payment",
									label: "Realiser Paiement",
									index: 3
								},
								{
									name: "/debt_payable",
									icon: "payment",
									label: "Comptes à Payer",
									index: 4
								},
								{
									name: "/debt_recievable",
									icon: "payment",
									label: "Comptes à Recevoir",
									index: 5
								},
								{
									name: "/banking",
									icon: "lock",
									label: "Banque",
									index: 6
								},
								{
									name: "/accounting_reports",
									icon: "chart bar outline",
									label: "Rapports",
									index: 7
								}
							];
							break;
						case "assistance":
							Options = [
								{
									name: "/warehouse",
									icon: "archive",
									label: "Stock",
									index: 0
								},
								{
									name: "/suppliers",
									icon: "users",
									label: "Fournisseurs",
									index: 1
								},
								{
									name: "/buys",
									icon: "cart",
									label: "Achats",
									index: 2
								},
								{
									name: "/assistance_reports",
									icon: "chart bar outline",
									label: "Rapports",
									index: 3
								}
							];
							break;
						default:
							Options = [];
							break;
					}
					const data = { user, token, Options };
					Cookie.save("sessionCookie", data, { path: "/", maxAge: 3600 });
					if (rememberMe === true) {
						const preferences = { email: username, rememberMe };
						Cookie.save("userPreferences", preferences, { path: "/" });
					} else {
						Cookie.remove("userPreferences");
					}
					api.api.defaults.headers.common["Authorization"] = "bearer " + token;
					dispatch(requestSuccessWithNavTree(LOGIN_SUCCESS, user, objResponse.data.message, token, Options));
				} else {
					dispatch(requestFail(LOGIN_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(LOGIN_FAIL, objError));
			});
	};
}

export function checkSession() {
	return dispatch => {
		dispatch(requestBegin(LOGGED_USER));
		let data = Cookie.load("sessionCookie");
		if (data !== undefined) {
			const { user, token, Options } = data;
			const decodedToken = decode(token);
			const tokenExpiration = decodedToken.exp;
			const currentTime = Math.floor(new Date().getTime() / 1000.0);
			const remainingTime = tokenExpiration - currentTime;
			Cookie.save("sessionCookie", data, {
				path: "/",
				maxAge: remainingTime
			});
			api.api.defaults.headers.common["Authorization"] = "bearer " + token;
			dispatch(requestSuccessWithNavTree(LOGGED_USER_SUCCESS, user, "Session Open", token, Options));
		} else {
			dispatch(requestFail(LOGGED_USER_FAIL, "No Session"));
		}
	};
}

export function resetToken() {
	return dispatch => {
		dispatch(requestBegin(REFRESH_TOKEN));
		return api
			.requestGET("/resetToken")
			.then(objResponse => {
				if (objResponse.data.success) {
					let data = Cookie.load("sessionCookie");
					data = { ...data, token: objResponse.data.data.token };
					Cookie.save("sessionCookie", data, { path: "/", maxAge: 3600 });
					api.api.defaults.headers.common["Authorization"] = "bearer " + objResponse.data.data.token;
					dispatch(requestSuccess(REFRESH_TOKEN_SUCCESS, null, objResponse.data.message, objResponse.data.data.token));
				} else {
					dispatch(requestFail(REFRESH_TOKEN_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(REFRESH_TOKEN_FAIL, objError.response));
			});
	};
}

export function getUsers() {
	return dispatch => {
		dispatch(requestBegin(GET_USERS));
		return api
			.requestGET("/users")
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(GET_USERS_SUCCESS, objResponse.data.data, objResponse.data.message, null));
				} else {
					dispatch(requestFail(GET_USERS_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(GET_USERS_FAIL, objError.response));
			});
	};
}

export function createUser(user, onClose) {
	return dispatch => {
		dispatch(requestBegin(CREATE_USER));
		return api
			.requestPOST("/users", {
				nom: user.nom,
				prenom: user.prenom,
				role: user.role,
				tel: user.tel,
				email: user.email,
				motDePasse: user.motDePasse,
				salaire: user.salaire,
				dateDeNaissance: user.dateDeNaissance,
				etatCivile: user.etatCivile,
				addresse: user.addresse
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(CREATE_USER_SUCCESS, objResponse.data.data, objResponse.data.message, null));
					onClose();
				} else {
					dispatch(requestFail(CREATE_USER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(CREATE_USER_FAIL, objError.response));
			});
	};
}

export function modifyUser(user, onClose) {
	return dispatch => {
		dispatch(requestBegin(MODIFY_USER));
		return api
			.requestPATCH(`/users/${user._id}`, {
				nom: user.nom,
				prenom: user.prenom,
				role: user.role,
				tel: user.tel,
				email: user.email,
				motDePasse: user.motDePasse,
				salaire: user.salaire,
				dateDeNaissance: user.dateDeNaissance,
				etatCivile: user.etatCivile,
				addresse: user.addresse,
				etat: user.etat
			})
			.then(objResponse => {
				if (objResponse.data.success) {
					dispatch(requestSuccess(MODIFY_USER_SUCCESS, objResponse.data.data, objResponse.data.message, null));
					onClose();
				} else {
					dispatch(requestFail(MODIFY_USER_FAIL, objResponse.data.message));
				}
			})
			.catch(objError => {
				dispatch(requestFail(MODIFY_USER_FAIL, objError.response));
			});
	};
}

// export function deleteUser(id, onClose) {
//   return dispatch => {
//     dispatch(deleteUserBegin());
//     return api
//       .requestDELETE(`/usuarios/${id.id}`)
//       .then(objResponse => {
//         console.log(objResponse);
//         dispatch(deleteUserSuccess(id.id));
//         onClose();
//       })
//       .catch(objError => {
//         dispatch(deleteUserFail(objError));
//       });
//   };
// }
