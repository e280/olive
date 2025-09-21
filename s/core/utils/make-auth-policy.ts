
import {MapG} from "@e280/stz"
import Renraku from "@e280/renraku"
import {AuthToken, User} from "../types.js"

export function makeAuthPolicy<
		Prerequisites extends {},
		Authorized,
	>(
		authorize: (prerequisites: Prerequisites) => (user: User) => Promise<Authorized>
	) {

	return <S extends Renraku.Service>(
			makeService: (authorized: Authorized) => S
		) => (

		Renraku.secure(async(prerequisites: {token: AuthToken} & Prerequisites) => {
			if (!prerequisites.token) throw new Error("bad token")

			// TODO
			// - verify authlocal claim token
			// - fetch user account associated with this auth id
			// - ascertain privileges for that account

			const user: User = {
				userId: "abc123",
				maintainer: true,
				memberships: new MapG(),
			}

			const authorized = await authorize(prerequisites)(user)
			return makeService(authorized)
		})
	)
}

