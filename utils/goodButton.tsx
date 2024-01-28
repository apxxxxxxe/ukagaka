import { useState, useEffect } from "react"
import { GoodButtonPostResponse, GoodLimit } from "pages/api/good"
import axios from "axios"
import { MaterialSymbol } from "react-material-symbols"

export default function GoodButton({
	id,
	align,
}: {
	id: string
	align: "start" | "center" | "end"
}) {
	const iconCode = "favorite"
	const iconColor = "#d03"
	const goodIcon = (
		<MaterialSymbol
			icon={iconCode}
			color={iconColor}
			className="mr-1"
			size={20}
		/>
	)
	const goodIconFilled = (
		<MaterialSymbol
			fill={true}
			icon={iconCode}
			color={iconColor}
			className="mr-1"
			size={20}
		/>
	)
	const [count, setCount] = useState(0)
	const [icon, setIcon] = useState<JSX.Element>(goodIcon)

	const setGoodIconByCount = (count: number) => {
		if (count >= 1) {
			setIcon(goodIconFilled)
		} else {
			setIcon(goodIcon)
		}
	}

	// IPアドレスで判定するので、SSRではなくクライアント側で実行する
	useEffect(() => {
		const fetch = async () => {
			await axios
				.get(`/api/good?id=${id}`)
				.then((res) => {
					const data: GoodButtonPostResponse = res.data
					setCount(data.todayCount)
					setGoodIconByCount(data.todayCount)
				})
				.catch((err) => {
					console.error(err)
				})
		}
		fetch()
	}, [])

	const onClickButton = async () => {
		if (count < GoodLimit) {
			setIcon(<span className="loader"></span>)
			await axios
				.post(`/api/good?id=${id}`)
				.then((res) => {
					const data: GoodButtonPostResponse = res.data
					setCount(data.todayCount)
					setGoodIconByCount(data.todayCount)
				})
				.catch((err) => {
					console.error(err)
				})
		}
	}

	return (
		<div
			className={`flex flex-row justify-${align}`}
			key={`good-button-${id}`}
		>
			<a
				className={`
        h-10 flex flex-row items-center
        select-none px-1.5 py-0.5 text-sm border-solid border border-gray/[0.6] rounded
        ${count < GoodLimit ? "hover:cursor-pointer shadow" : "bg-lightgray"}
        `}
				onClick={onClickButton}
			>
				<div className="loader-wrapper">{icon}</div>
				<span>{`${count}/${GoodLimit}`}</span>
			</a>
		</div>
	)
}
