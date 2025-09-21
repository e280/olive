
import {html} from "lit"
import {view} from "@e280/sly"

import {Router} from "../router.js"
import styleCss from "./style.css.js"
import {Context} from "../context.js"
import themeCss from "../theme.css.js"
import menu2Svg from "../icons/tabler/menu-2.svg.js"
import {DashboardView} from "../pages/dashboard/view.js"

export class OliveApp extends (view.component(use => {
	use.css(themeCss, styleCss)

	const context = use.once(() => new Context())
	const router = use.once(() => new Router(
		[/^$/, () => DashboardView.props(context).children(html`<slot></slot>`).render()],
		[/^#\/a\/$/, () => html`account`],
		[/^#\/o\/$/, () => html`orglist`],
		[/^#\/o\/(\w+)$/, orgId => html`org ${orgId}`],
		[/^#\/c\/$/, () => html`chatlist`],
		[/^#\/c\/(\w+)$/, chatId => html`chat ${chatId}`],
		[/.*/, () => html`404 not found`],
	))

	const {hash} = router
	const $navOpen = use.signal(false)

	const toggleNav = () => $navOpen(!$navOpen())
	const closeNav = () => $navOpen(false)

	const renderLink = (label: string, url: string, isActive: boolean) => html`
		<a
			href="${url}"
			?data-active="${isActive}"
			@click="${closeNav}">
				${label}
		</a>
	`

	return html`
		<nav ?data-open="${$navOpen()}">
			<button theme=icon @click="${toggleNav}">${menu2Svg}</button>
			<div class=navplate ?inert="${!$navOpen()}">
				<header>
					<img alt="" src="/assets/olive.png"/>
					<div>
						<h1>Olive Support <small>v${context.version}</small></h1>
						<p>Simple secure customer support.</p>
					</div>
				</header>
				<div class=links>
					${renderLink("Dashboard", "#/", hash === "")}
					${renderLink("Account", "#/a/", hash.startsWith("#/a/"))}
					${renderLink("Orgs", "#/o/", hash.startsWith("#/a/"))}
					${renderLink("Chats", "#/c/", hash.startsWith("#/c/"))}
				</div>
			</div>
		</nav>

		<main>${router.$content()}</main>

		<div class=blanket
			?inert="${!$navOpen()}"
			?data-active="${$navOpen()}"
			@click="${closeNav}">
		</div>
	`
})) {}

