import { useState, useEffect, useRef } from "react"
import {
	GoodButtonPostResponse,
	GoodButtonStatus,
	GoodLimit,
} from "pages/api/good"
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

	const countRef = useRef<number>(0)
	const [icon, setIcon] = useState<JSX.Element>(goodIcon)
	const [surfaceCount, setSurfaceCount] = useState<number>(0)

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
					countRef.current = data.todayCount
					setGoodIconByCount(data.todayCount)
					setSurfaceCount(data.todayCount)
				})
				.catch((err) => {
					console.error(err)
				})
		}
		fetch()
	}, [])

	const onClickButton = () => {
		if (countRef.current < GoodLimit) {
			countRef.current = countRef.current + 1
			setGoodIconByCount(countRef.current)
			setSurfaceCount(countRef.current)

			// 非同期でAPIを叩く
			axios
				.post(`/api/good?id=${id}`)
				.then((res) => {
					const data: GoodButtonPostResponse = res.data
					if (data.goodButtonStatus !== GoodButtonStatus.OK) {
						countRef.current = data.todayCount
					}
					setGoodIconByCount(countRef.current)
					setSurfaceCount(countRef.current)
				})
				.catch((err) => {
					countRef.current = countRef.current - 1
					setGoodIconByCount(countRef.current)
					setSurfaceCount(countRef.current)
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
        select-none px-1.5 py-0.5 text-sm border-solid border border-gray/[0.6] rounded active:bg-lightgray active:shadow-inner
        ${
			countRef.current < GoodLimit
				? "hover:cursor-pointer shadow"
				: "bg-lightgray shadow-inner"
		}
        `}
				onClick={onClickButton}
			>
				<div className="flex items-center justify-center">{icon}</div>
				<span>{`${surfaceCount}/${GoodLimit}`}</span>
			</a>
		</div>
	)
}
