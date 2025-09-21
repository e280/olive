
import {html} from "lit"
import {view} from "@e280/sly"

import {Router} from "../router.js"
import styleCss from "./style.css.js"
import {Context} from "../context.js"
import themeCss from "../theme.css.js"
import {Taglines} from "./utils/taglines.js"
import menu2Svg from "../icons/tabler/menu-2.svg.js"
import {DashboardView} from "../pages/dashboard/view.js"

export class OliveApp extends (view.component(use => {
	use.css(themeCss, styleCss)

	const context = use.once(() => new Context())
	const router = use.once(() => new Router(
		[/^$/, () => DashboardView.props(context).children(html`<slot></slot>`).render()],
		[/^#\/account$/, () => html`account`],
		[/^#\/orgs$/, () => html`orglist`],
		[/^#\/org\/(\w+)$/, orgId => html`org ${orgId}`],
		[/^#\/chats$/, () => html`chatlist`],
		[/^#\/chat\/(\w+)$/, chatId => html`chat ${chatId}`],
		[/.*/, () => html`404 not found`],
	))

	const {hash} = router
	const $navOpen = use.signal(false)
	const taglines = use.once(() => new Taglines())

	const toggleNav = async(force?: boolean) => {
		const value = force === undefined
			? !$navOpen()
			: force
		if (value) await taglines.nextTagline()
		await $navOpen(value)
	}

	const closeNav = () => toggleNav(false)

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
			<button theme=icon @click="${() => toggleNav()}">${menu2Svg}</button>
			<div class=navplate ?inert="${!$navOpen()}">
				<header>
					<img alt="" src="/assets/olive.png"/>
					<div>
						<h1>
							<strong>Olive Support</strong>
							<small>v${context.version}</small>
						</h1>
						<p>${taglines.$tagline()}</p>
					</div>
				</header>
				<div class=links>
					${renderLink("🫒 Dashboard", "#/", hash === "")}
					${renderLink("👤 Account", "#/account", hash.startsWith("#/account"))}
					${renderLink("🏛 Orgs", "#/orgs", hash.startsWith("#/orgs"))}
					${renderLink("💬 Chats", "#/chats", hash.startsWith("#/chats"))}
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

