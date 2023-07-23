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
		<div className="webclap-box">
			<a
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
