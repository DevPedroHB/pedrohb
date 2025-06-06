import { ImageResponse } from "next/og";

export const size = {
	width: 32,
	height: 32,
};
export const contentType = "image/png";

export default function Icon() {
	return new ImageResponse(
		<img
			src="https://github.com/DevPedroHB.png"
			alt="DevPedroHB"
			className="w-full h-full object-center object-cover"
		/>,
		{
			...size,
		},
	);
}
