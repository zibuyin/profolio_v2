import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export default function ScrollIndicator() {
	return (
		<div className="flex flex-col gap-2 items-center justify-center">
			{/* <p>Welcome</p> */}
			<FontAwesomeIcon
				icon={faAngleDown}
				bounce
				className="justify-self-center scale-200"
			/>
		</div>
	);
}
