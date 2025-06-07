import { navbarLinks } from "@/constants/navbar-links";
import Link from "next/link";

export function Header() {
	return (
		<header>
			<nav>
				<div>
					<h1>PedroHB</h1>
				</div>
				<div>
					{navbarLinks.map((link) => {
						return (
							<Link key={link.path} href={link.path}>
								{link.name}
							</Link>
						);
					})}
				</div>
			</nav>
		</header>
	);
}
