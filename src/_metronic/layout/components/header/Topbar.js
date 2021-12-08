import React, { useMemo } from 'react'
import objectPath from 'object-path'
import { useHtmlClassService } from '../../_core/MetronicLayout'
import { MyCartDropdown } from '../extras/dropdowns/MyCartDropdown'
import { QuickUserToggler } from '../extras/QuiclUserToggler'

export function Topbar() {
	const uiService = useHtmlClassService()

	const layoutProps = useMemo(() => {
		return {
			viewCartDisplay: objectPath.get(uiService.config, 'extras.cart.display'),
			viewUserDisplay: objectPath.get(uiService.config, 'extras.user.display'),
		}
	}, [uiService])

	return (
		<div className='topbar'>
			{layoutProps.viewCartDisplay && <MyCartDropdown />}

			{layoutProps.viewUserDisplay && <QuickUserToggler />}
		</div>
	)
}
