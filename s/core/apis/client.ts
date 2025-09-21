
import Renraku from "@e280/renraku"

export const makeClientApi = () => Renraku.asRpc(async _meta => ({v1: {
	chats: {
		async reportTypingActivity() {},
		async newPost() {},
		async editedPost() {},
		async chatParticipantsChanged() {},
		async chatClosed() {},
	},
}}))

