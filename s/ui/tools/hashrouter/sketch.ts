
import {ev, ob} from "@e280/stz"
import {Content, Op} from "@e280/sly"

export type Hasher<Params extends any[]> = {
	parse: (hash: string) => (Params | null)
	make: (...params: Params) => string
}

export type Route<Params extends any[]> = {
	hasher: Hasher<any>
	fn: (...params: Params) => Promise<Content>
}

export type Routes = {[key: string]: Route<any>}

export function ezhasher<P extends string[]>(spec: (string | {})[]): Hasher<P> {
	return {
		parse: hash => {
			const hashparts = hash.split("/").slice(1)
			const params: string[] = []
			for (const [index, hashpart] of hashparts.entries()) {
				const specpart = spec.at(index)
				if (typeof specpart === "string") {
					if (hashpart !== specpart)
						return null
				}
				else {
					params.push(hashpart)
				}
			}
			return params as P
		},
		make: (...params: P) => {
			let paramIndex = 0
			const hashparts: string[] = ["#"]
			for (const specpart of spec) {
				if (typeof specpart === "string") {
					hashparts.push(specpart)
				}
				else {
					hashparts.push(params.at(paramIndex)!)
					paramIndex++
				}
			}
			return hashparts.join("/")
		},
	}
}

export function ezroute<P extends string[]>(
		spec: (string | {})[],
		fn: (...params: P) => Promise<Content>,
	): Route<P> {

	return {
		hasher: ezhasher(spec),
		fn,
	}
}

export function getNormalizedWindowHash() {
	const hash = window.location.hash
	const homeEquivalents = [/^$/, /^#$/, /^#\/$/]
	if (homeEquivalents.some(regex => regex.test(hash))) {
		history.replaceState(null, "", window.location.pathname + window.location.search)
		return "#/"
	}
	return hash
}

export function setWindowHash(hash: string) {
	window.location.hash = hash
}

export type Hashnav<R extends Routes> = {
	[K in keyof R]: (...params: Parameters<R[K]["hasher"]["make"]>) => Promise<ResolvedRoute<R>>
}

export function makeNavigation<R extends Routes>(routes: R, navigate: (hash: string) => Promise<ResolvedRoute<R>>): Hashnav<R> {
	return ob(routes).map(route => (
		async(...params: string[]) => navigate(route.hasher.make(...params))
	))
}

export type ResolvedRoute<R extends Routes> = {
	key: keyof R
	route: Route<any>
	params: any[]
	op: Op<Content>
}

export function resolveRoute<R extends Routes>(hash: string, routes: R): ResolvedRoute<R> | null {
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

