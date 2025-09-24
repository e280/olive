
import type {Content} from "@e280/sly"
import {Hasher, Route} from "./types.js"

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

