import axios from 'axios'

const PRODUCTS_URL = process.env.REACT_APP_API_URL + '/api/products'

// CREATE =>  POST: add a new product to the server
export function createProduct(product) {
	return axios.post(PRODUCTS_URL, product)
}

// READ
export function getAllProducts() {
	return axios.get(PRODUCTS_URL)
}

export function getProductById(productId) {
	return axios.get(`${PRODUCTS_URL}/${productId}`)
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findProducts(queryParams) {
	let url = PRODUCTS_URL
	if (queryParams) url += `?queryParams=${JSON.stringify(queryParams)}`
	return axios.get(url)
}

// UPDATE => PUT: update the procuct on the server
export function updateProduct(product) {
	return axios.put(`${PRODUCTS_URL}/`, product)
}

// UPDATE Status
export function updateStatusForProducts(ids, status) {
	return axios.post(`${PRODUCTS_URL}/updateStatusForProducts`, {
		ids,
		status,
	})
}

// DELETE => delete the product from the server
export function deleteProduct(productId) {
	return axios.delete(`${PRODUCTS_URL}/${productId}`)
}

// DELETE Products by ids
export function deleteProducts(ids) {
	return axios.post(`${PRODUCTS_URL}/deleteProducts`, { ids })
}
