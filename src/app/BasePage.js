import React, { Suspense } from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { LayoutSplashScreen, ContentRoute } from '../_metronic/layout'
import { Landing } from './modules/Vasiti/pages/Landing'

export default function BasePage() {
	return (
		<Suspense fallback={<LayoutSplashScreen />}>
			<Switch>
				<ContentRoute path='/' component={Landing} />
				<Redirect to='error/error-v1' />
			</Switch>
		</Suspense>
	)
}
