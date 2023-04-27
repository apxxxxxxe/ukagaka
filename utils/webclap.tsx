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
				<img
					src={`http://img.webclap.com/webclap/button/off.php?img=39`}
					style={{ width: "auto" }}
				/>
			</a>
		</div>
	)
}

export default WebClapBox
