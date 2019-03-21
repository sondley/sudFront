import axios from "axios";

const api = axios.create();
api.defaults.baseURL = `https://grandsudapi.herokuapp.com/`;
//api.defaults.baseURL = `http://localhost:8080/`;
function requestGET(route, params) {
	return api.get(route, params);
}

function requestPOST(route, params) {
	return api.post(route, params);
}

function requestDELETE(route, params) {
	return api.delete(route, params);
}

function requestPUT(route, params) {
	return api.put(route, params);
}

function requestPATCH(route, params) {
	return api.patch(route, params);
}

export default {
	api,
	requestGET,
	requestPOST,
	requestDELETE,
	requestPUT,
	requestPATCH
};
