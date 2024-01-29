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
	const [fakeCount, setFakeCount] = useState<number | null>(null)
	const [icon, setIcon] = useState<JSX.Element>(goodIcon)

	const getSurfaceCount = (count: number) => {
		if (fakeCount !== null) {
			return fakeCount
		}
		return count
	}

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

	const onClickButton = () => {
		if (getSurfaceCount(count) < GoodLimit) {
			const fc = fakeCount ? fakeCount + 1 : count + 1
			setFakeCount(fc)
			setGoodIconByCount(fc)

			// 非同期でAPIを叩く
			axios
				.post(`/api/good?id=${id}`)
				.then((res) => {
					const data: GoodButtonPostResponse = res.data
					setCount(data.todayCount)
					if (fakeCount !== null && fakeCount <= data.todayCount) {
						setFakeCount(null)
						setGoodIconByCount(data.todayCount)
					}
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
        select-none px-1.5 py-0.5 text-sm border-solid border border-gray/[0.6] rounded active:bg-lightgray active:shadow-inner
        ${
			getSurfaceCount(count) < GoodLimit
				? "hover:cursor-pointer shadow"
				: "bg-lightgray shadow-inner"
		}
        `}
				onClick={onClickButton}
			>
				<div className="flex items-center justify-center">{icon}</div>
				<span>{`${getSurfaceCount(count)}/${GoodLimit}`}</span>
			</a>
		</div>
	)
}
