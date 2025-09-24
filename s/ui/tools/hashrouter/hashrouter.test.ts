
import {Hashrouter} from "./hashrouter.js"
import { ezroute } from "./plumbing/ez.js"
import {Routes} from "./plumbing/types.js"
import {Science, test, expect} from "@e280/science"

async function setup<R extends Routes>(routes: R) {
	const location = {hash: ""}
	const hashrouter = new Hashrouter({
		routes,
		getHash: () => location.hash,
		setHash: hash => { location.hash = hash },
	})
	return {location, hashrouter}
}

export default Science.suite({
	init: Science.suite({
		"/#/hello/world": test(async() => {
			const {location, hashrouter} = await setup({
				helloWorld: ezroute(["hello", "world"], async() => "123"),
			})
			expect(hashrouter.content).is(null)
			location.hash = "#/hello/world"
			await hashrouter.update()
			expect(hashrouter.content).is("123")
		}),
	}),
})

