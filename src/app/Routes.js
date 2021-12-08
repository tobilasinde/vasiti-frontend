import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Layout } from '../_metronic/layout'
import BasePage from './BasePage'

export function Routes() {
	return (
		<Switch>
			<Route path='/error' component={() => 'hi'} />

			<Layout>
				<BasePage />
			</Layout>
		</Switch>
	)
}
