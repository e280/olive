
import Renraku from "@e280/renraku"
import {ChatId, MemberRole, OrgId} from "./types.js"
import {makeAuthPolicy} from "./utils/make-auth-policy.js"

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

