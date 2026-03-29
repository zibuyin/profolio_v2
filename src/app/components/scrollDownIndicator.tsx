import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export default function ScrollIndicator() {
	return (
		<div className="flex flex-col gap-2 items-center justify-center h-10">
			{/* <p>Welcome</p> */}
			<FontAwesomeIcon
				icon={faAngleDown}
				className="w-10 h-10 justify-self-center"
			/>
		</div>
	);
}
