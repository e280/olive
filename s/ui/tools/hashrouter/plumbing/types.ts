
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

export type ResolvedRoute<R extends Routes> = {
	key: keyof R
	route: Route<any>
	params: any[]
	op: Op<Content>
}

export type Hashnav<R extends Routes> = {
	[K in keyof R]: (...params: Parameters<R[K]["hasher"]["make"]>) => Promise<ResolvedRoute<R>>
}

