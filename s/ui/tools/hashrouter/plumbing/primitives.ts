
import {Op} from "@e280/sly"
import {ev, ob} from "@e280/stz"
import {Hashnav, ResolvedRoute, Routes} from "./types.js"

export function getNormalizedWindowHash() {
	const hash = window.location.hash
	const homeEquivalents = [/^$/, /^#$/, /^#\/$/]
	if (homeEquivalents.some(regex => regex.test(hash))) {
		const {pathname, search} = window.location
		history.replaceState(null, "", pathname + search)
		return "#/"
	}
	return hash
}

export function setWindowHash(hash: string) {
	window.location.hash = hash
}

export function makeNavigation<R extends Routes>(
		routes: R,
		navigate: (hash: string) => Promise<ResolvedRoute<R>>,
	): Hashnav<R> {

	return ob(routes).map(route => (
		async(...params: string[]) => navigate(route.hasher.make(...params))
	))
}

export function resolveRoute<R extends Routes>(
		hash: string,
		routes: R,
	): ResolvedRoute<R> | null {

	for (const [key, route] of Object.entries(routes)) {
		const match = route.hasher.parse(hash)
		if (match) {
			const params = match
			return {
				key,
				route,
				params,
				op: Op.promise(route.fn(...params))
			}
		}
	}

	return null
}

export function onHashChange(fn: (event: HashChangeEvent) => void) {
	return ev(window, {hashchange: fn})
}

