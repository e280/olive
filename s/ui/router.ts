
import {ev} from "@e280/stz"
import {Content} from "@e280/sly"
import {signal} from "@e280/strata"

export type Route = [RegExp, (...captured: string[]) => Content]

export class Router {
	routes: Route[]
	$content = signal<Content>(null)
	dispose = ev(window, {hashchange: () => this.route()})

	constructor(...routes: Route[]) {
		this.routes = routes
		this.route()
	}

	get hash() {
		const hash = window.location.hash
		const homeEquivalents = [/^#$/, /^#\/$/]

		if (homeEquivalents.some(regex => regex.test(hash))) {
			history.replaceState(null, "", window.location.pathname + window.location.search)
			return ""
		}

		return hash
	}

	async route() {
		const {hash} = this
		for (const [regex, fn] of this.routes) {
			const result = hash.match(regex)
			if (result) {
				const content = fn(...result.slice(1))
				await this.$content.set(content)
				break
			}
		}
	}
}

