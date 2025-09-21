
import Renraku from "@e280/renraku"
import {ChatId} from "../types.js"
import {policies} from "../policies.js"

export type ServerApi = Awaited<ReturnType<ReturnType<typeof makeServerApi>>>

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

