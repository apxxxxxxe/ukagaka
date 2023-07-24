const WebClapBox = () => {
	const opener = () => {
		window.open(
			"http://clap.webclap.com/clap.php?id=apxxxxxxe",
			"webclap",
			"toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes"
		)
		return false
	}

	return (
		<div className="flex flex-row justify-end">
			<a
				className="px-1.5 py-0.5 text-sm border-solid border border-gray/[0.6] rounded shadow"
				href="http://clap.webclap.com/clap.php?id=apxxxxxxe"
				target="_blank"
				onClick={opener}
			>
				WEB拍手
			</a>
		</div>
	)
}

export default WebClapBox
