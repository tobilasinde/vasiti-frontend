import { all } from 'redux-saga/effects'
import { combineReducers } from 'redux'

import * as auth from './authRedux'
import { productsSlice } from '../app/modules/Vasiti/redux/productsSlice'

export const rootReducer = combineReducers({
	auth: auth.reducer,
	products: productsSlice.reducer,
})

export function* rootSaga() {
	yield all([auth.saga()])
}
