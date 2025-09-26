
import {html} from "lit"
import {spa, view} from "@e280/sly"

import styleCss from "./style.css.js"
import {Context} from "../context.js"
import themeCss from "../theme.css.js"
import {Taglines} from "./utils/taglines.js"
import menu2Svg from "../icons/tabler/menu-2.svg.js"
import {DashboardView} from "../pages/dashboard/view.js"

export class OliveApp extends (view.component(use => {
	use.css(themeCss, styleCss)

	const context = use.once(() => new Context())

	const router = use.once(() => new spa.Router({
		routes: {
			dashboard: spa.route("#/", async() =>
				DashboardView
					.props(context)
					.children(html`<slot></slot>`)
					.render()
			),
			account: spa.route("#/account", async() => html`account`),
			orgs: spa.route("#/orgs", async() => html`orgs`),
			org: spa.route("#/org/{orgId}", async({orgId}) => html`org ${orgId}`),
			chats: spa.route("#/chats", async() => html`chats`),
			chat: spa.route("#/chat/{chatId}", async({chatId}) => html`chat ${chatId}`),
		},
	}))

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

	const renderLink = <N extends spa.Navigable>(
			label: string,
			nav: N,
			...params: spa.Params<N>
		) => html`
		<a
			href="${nav.hash(...params)}"
			?data-active="${nav.active}"
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
					${renderLink("🫒 Dashboard", router.nav.dashboard)}
					${renderLink("👤 Account", router.nav.account)}
					${renderLink("🏛 Orgs", router.nav.orgs)}
					${renderLink("💬 Chats", router.nav.chats)}
				</div>
			</div>
		</nav>

		<main>${router.render()}</main>

		<div class=blanket
			?inert="${!$navOpen()}"
			?data-active="${$navOpen()}"
			@click="${closeNav}">
		</div>
	`
})) {}

