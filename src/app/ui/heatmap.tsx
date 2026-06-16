export default function Heatmap() {
	return (
		<a
			href="https://heatmap.shymike.dev?id=624&timezone=Europe%2FLondon&standalone=true"
			title="Click to view detailed data for each day!"
			className="block w-full mt-5"
		>
			<picture>
				<source
					media="(prefers-color-scheme: dark)"
					srcSet="https://heatmap.shymike.dev?id=624&timezone=Europe%2FLondon&theme=dark"
				/>
				<img
					alt="Hackatime activity heatmap"
					src="https://heatmap.shymike.dev?id=624&timezone=Europe%2FLondon&theme=light"
					className="block w-full h-auto"
				/>
			</picture>
		</a>
	);
}
