import { FaCircle } from "react-icons/fa6";

export default function StatusBadge() {
	return (
		<a
			href="https://status.nathanyin.com"
			className="group hover:-translate-y-0.5 transition-all"
		>
			<div className="flex p-2 gap-2 items-center rounded-full px-3">
				<div className="relative flex">
					{/* <FaCircle className="text-green-500"></FaCircle> */}
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-700 opacity-75"></span>
					<span className="relative inline-flex size-3 rounded-full bg-green-600"></span>
				</div>
				<div className="ml-0">
					<p className="whitespace-nowrap">All services online</p>
				</div>
			</div>
		</a>
	);
}
