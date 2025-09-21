
import {MapG} from "@e280/stz"

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

