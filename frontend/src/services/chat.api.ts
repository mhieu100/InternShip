import { IBackendRes, IConversation } from 'types/backend'
import axios from './axios-customize'

const CHAT_API_URL = 'http://localhost:8089'

export const callCreateSingleChat = (participantId: number) => {
  return axios.post<IBackendRes<IConversation>>(
    `${CHAT_API_URL}/api/conversations/create-single`,
    {
      participantId
    }
  )
}

export const callCreateGroupChat = (
  conversationName: string,
  participantIds: number[]
) => {
  console.log(conversationName, participantIds)
  return axios.post<IBackendRes<IConversation>>(
    `${CHAT_API_URL}/api/conversations/create-group`,
    {
      conversationName,
      participantIds
    }
  )
}

export const callMyConversations = () => {
  return axios.get<IBackendRes<IConversation[]>>(
    `${CHAT_API_URL}/api/conversations/my-conversations`
  )
}
