import {
	Briefcase,
	FileText,
	Home,
	Image,
	SendHorizontal,
	User2,
} from "lucide-react";

export const navbarLinks = [
	{
		name: "Início",
		icon: Home,
		path: "#hero",
	},
	{
		name: "Sobre mim",
		icon: User2,
		path: "#about-me",
	},
	{
		name: "Habilidades",
		icon: FileText,
		path: "#skills",
	},
	{
		name: "Serviços",
		icon: Briefcase,
		path: "#services",
	},
	{
		name: "Portfólio",
		icon: Image,
		path: "#portfolio",
	},
	{
		name: "Contato",
		icon: SendHorizontal,
		path: "#contact-me",
	},
] as const;
