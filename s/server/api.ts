
import {MapG} from "@e280/stz"
import Renraku from "@e280/renraku"

export type OrgId = string
export type ChatId = string
export type AuthToken = string
export type MemberRole = "admin" | "manager" | "agent" | "observer"

export type Membership = {
	roles: Set<MemberRole>
}

export type User = {
	userId: string
	maintainer: boolean
	memberships: MapG<OrgId, Membership>
}

export type ServerApi = Awaited<ReturnType<ReturnType<typeof makeServerApi>>>

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

export const policies = {
	anybody: makeAuthPolicy(() => async user => ({user})),

	isManager: makeAuthPolicy(({orgId}: {orgId: OrgId}) => async user => {
		if (!user.maintainer) {
			const membership = user.memberships.require(orgId)
			const allowedRoles: MemberRole[] = ["manager", "admin"]
			const allowed = allowedRoles.some(r => membership.roles.has(r))
			if (!allowed) throw new Renraku.ExposedError("not allowed")
		}
		return {user, orgId}
	}),

	isObserver: makeAuthPolicy(({orgId}: {orgId: OrgId}) => async user => {
		if (!user.maintainer) {
			const membership = user.memberships.require(orgId)
			const allowedRoles: MemberRole[] = ["observer", "agent", "manager", "admin"]
			const allowed = allowedRoles.some(r => membership.roles.has(r))
			if (!allowed) throw new Renraku.ExposedError("not allowed")
		}
		return {user, orgId}
	}),

	canParticipateInChat: makeAuthPolicy(({chatId}: {chatId: ChatId}) => async user => {
		return {user, chatId}
	}),
}

export const makeServerApi = () => Renraku.asRpc(async _meta => ({v1: {
	accounting: policies.anybody(({user}) => ({
		async getAccount() {},
		async updateAccount(accountParams: any) {},
	})),

	orgs: {
		async readOrg(orgId: string) {},
		async queryOrgs(orgQuery: any) {},

		...policies.anybody(({user}) => ({
			async listMyRecentOrgs() {},
		})),

		...policies.isManager(({user}) => ({
			async listMyOrgs() {},
			async createOrg() {},
			async updateOrg() {},
			async archiveOrg() {},
		})),
	},

	chats: {
		...policies.anybody(({user}) => ({
			async getChat(chatId: ChatId, pagination: any) {},
			async queryMyChats(chatQuery: any) {},
			async createChat(orgId: string, chatParams: any) {},
		})),

		...policies.canParticipateInChat(({user, chatId}) => ({
			async newPost(postParams: any) {},
			async editPost(editParams: any) {},
			async closeChat() {},
			async reopenChat() {},
		})),

		...policies.isObserver(({user, orgId}) => ({
			async queryOrgChats(chatQuery: any) {},
		})),
	},
}}))

export const makeClientApi = () => Renraku.asRpc(async _meta => ({v1: {
	chats: {
		async reportTypingActivity() {},
		async newPost() {},
		async editedPost() {},
		async chatParticipantsChanged() {},
		async chatClosed() {},
	},
}}))

