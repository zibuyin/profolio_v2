import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";

export default function ScrollIndicator() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<FontAwesomeIcon
				icon={faAnglesDown}
				className="w-10 justify-self-center"
			/>
		</div>
	);
}
