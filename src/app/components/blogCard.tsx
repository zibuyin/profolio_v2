import { FaRegClock } from "react-icons/fa";
interface BlogCardProps {
	title: string;
	subtitle: string;
	date: string;
	slug: string;
	readTime: string;
}
export default function BlogCard({
	title,
	subtitle,
	date,
	slug,
	readTime,
}: BlogCardProps) {
	return (
		<a href={`blog/${slug}`}>
			<div className="flex flex-col md:flex-row gap-2 md:gap-10 mb-2 mt-2 transition-all duration-300 hover:-translate-y-0.5">
				<p className="text-gray-500">{date}</p>
				<div className="flex flex-row md:w-[50vw] ">
					<p className="mr-1 font-bold underline underline-offset-2">
						{title}
					</p>
					<p>-</p>
					<p className="ml-1">{subtitle}</p>
				</div>

				<div className="flex flex-row items-center text-gray-500 gap-1">
					<FaRegClock />
					<p>{readTime}</p>
				</div>
			</div>
			{/* <div className="bg-gray-500 w-full h-[1px]"></div> */}
		</a>
	);
}
