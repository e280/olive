
import {ssg, html} from "@e280/scute"

const title = "Olive Support"
const domain = "olive.e280.org"
const favicon = "/assets/olive.png"
const description = "Customer support, but it's good"

export default ssg.page(import.meta.url, async orb => ({
	title,
	js: "main.bundle.min.js",
	css: "main.css",
	dark: true,
	favicon,

	socialCard: {
		title,
		description,
		themeColor: "#A1C33F",
		siteName: domain,
		image: `https://${domain}${favicon}`,
	},

	head: html`
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Alan+Sans:wght@300..900&display=swap" rel="stylesheet">
		<meta content="app-version" value="${orb.packageVersion()}"/>
	`,

	body: html`
		<olive-app>
			<section>
				<img class=logo src="/assets/olive.png" alt=""/>
				<h1>Olive Support</h1>
				<p>Customer support, but less terrible</p>
				<p class=version>v${orb.packageVersion()}</p>
			</section>
		</olive-app>
	`,
}))

