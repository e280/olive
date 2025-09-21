
import {signal} from "@e280/strata"
import {Dispenser} from "@e280/stz"

export class Taglines {
	dispenser = new Dispenser(() => [
		"Customer support, but less terrible",
		"Customer support, but it's good",
		"Simple, secure, and easy",
		"We're here to help",
		"Support without surveillance",
		"Encrypted end-to-end",
		"Sane support software",
	])

	$tagline = signal(this.dispenser.takeRandom())

	async nextTagline() {
		await this.$tagline.set(this.dispenser.takeRandom())
	}
}

