import { mdiHandHeartOutline } from "@mdi/js"
import Icon from "@mdi/react"

export default function Header(){

	return (
		<div className="d-flex flex-row align-items-center justify-content-center my-4">
			<Icon path={mdiHandHeartOutline} size={1.5} className="me-3" />
			<h2 className="my-0">Rescue RS</h2>
		</div>
	)
}