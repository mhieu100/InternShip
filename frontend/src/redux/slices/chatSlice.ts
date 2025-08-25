// import { createSlice } from '@reduxjs/toolkit'

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState: {
//     conversations: [
//       {
//         id: 1,
//         name: 'Nguyễn Văn A',
//         avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
//         lastMessage: 'Chào bạn! Bạn có khỏe không?',
//         lastMessageTime: '10:30',
//         isOnline: true,
//         unreadCount: 2,
//         messages: [
//           {
//             id: 1,
//             senderId: 1,
//             senderName: 'Nguyễn Văn A',
//             content: 'Chào bạn!',
//             timestamp: '2024-01-15T10:25:00Z',
//             type: 'text',
//             status: 'seen'
//           },
//           {
//             id: 2,
//             senderId: 'me',
//             senderName: 'Tôi',
//             content: 'Chào! Mình khỏe, cảm ơn bạn',
//             timestamp: '2024-01-15T10:26:00Z',
//             type: 'text',
//             status: 'seen'
//           },
//           {
//             id: 3,
//             senderId: 1,
//             senderName: 'Nguyễn Văn A',
//             content: 'Bạn có khỏe không?',
//             timestamp: '2024-01-15T10:30:00Z',
//             type: 'text',
//             status: 'delivered'
//           }
//         ]
//       },
//       {
//         id: 2,
//         name: 'Trần Thị B',
//         avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
//         lastMessage: 'Hẹn gặp lại bạn!',
//         lastMessageTime: '09:15',
//         isOnline: false,
//         lastSeen: '2 giờ trước',
//         unreadCount: 0,
//         messages: [
//           {
//             id: 1,
//             senderId: 2,
//             senderName: 'Trần Thị B',
//             content: 'Cảm ơn bạn về buổi họp hôm nay',
//             timestamp: '2024-01-15T09:10:00Z',
//             type: 'text',
//             status: 'seen'
//           },
//           {
//             id: 2,
//             senderId: 'me',
//             senderName: 'Tôi',
//             content: 'Không có gì, hẹn gặp lại!',
//             timestamp: '2024-01-15T09:12:00Z',
//             type: 'text',
//             status: 'seen'
//           },
//           {
//             id: 3,
//             senderId: 2,
//             senderName: 'Trần Thị B',
//             content: 'Hẹn gặp lại bạn!',
//             timestamp: '2024-01-15T09:15:00Z',
//             type: 'text',
//             status: 'seen'
//           }
//         ]
//       },
//       {
//         id: 3,
//         name: 'Nhóm Dự Án',
//         avatar: 'https://via.placeholder.com/40/4CAF50/FFFFFF?text=DA',
//         lastMessage: 'Lê Văn C: Đã upload file báo cáo',
//         lastMessageTime: 'Hôm qua',
//         isOnline: true,
//         unreadCount: 5,
//         isGroup: true,
//         messages: [
//           {
//             id: 1,
//             senderId: 3,
//             senderName: 'Lê Văn C',
//             content: 'Mọi người check email nhé',
//             timestamp: '2024-01-14T16:30:00Z',
//             type: 'text',
//             status: 'seen'
//           },
//           {
//             id: 2,
//             senderId: 4,
//             senderName: 'Phạm Thị D',
//             content: 'OK, mình đã xem rồi',
//             timestamp: '2024-01-14T16:35:00Z',
//             type: 'text',
//             status: 'seen'
//           },
//           {
//             id: 3,
//             senderId: 3,
//             senderName: 'Lê Văn C',
//             content: 'Đã upload file báo cáo',
//             timestamp: '2024-01-14T17:00:00Z',
//             type: 'text',
//             status: 'delivered'
//           }
//         ]
//       }
//     ],
//     activeConversation: null,
//     searchTerm: '',
//     isTyping: false,
//     typingUsers: [],
//     pinnedMessages: [],
//     chatTheme: {
//       backgroundColor: '#f5f5f5',
//       bubbleColor: '#1890ff',
//       textColor: '#000000'
//     }
//   },
//   reducers: {
//     setActiveConversation: (state, action) => {
//       state.activeConversation = action.payload
//       // Mark messages as read when opening conversation
//       const conversation = state.conversations.find(
//         (conv) => conv.id === action.payload
//       )
//       if (conversation) {
//         conversation.unreadCount = 0
//       }
//     },
//     sendMessage: (state, action) => {
//       const { conversationId, message } = action.payload
//       const conversation = state.conversations.find(
//         (conv) => conv.id === conversationId
//       )
//       if (conversation) {
//         const newMessage = {
//           id: Date.now(),
//           senderId: 'me',
//           senderName: 'Tôi',
//           content: message.content,
//           timestamp: new Date().toISOString(),
//           type: message.type || 'text',
//           status: 'sent'
//         }
//         conversation.messages.push(newMessage)
//         conversation.lastMessage =
//           message.type === 'text' ? message.content : 'Đã gửi một tệp'
//         conversation.lastMessageTime = new Date().toLocaleTimeString('vi-VN', {
//           hour: '2-digit',
//           minute: '2-digit'
//         })
//       }
//     },
//     receiveMessage: (state, action) => {
//       const { conversationId, message } = action.payload
//       const conversation = state.conversations.find(
//         (conv) => conv.id === conversationId
//       )
//       if (conversation) {
//         conversation.messages.push(message)
//         conversation.lastMessage = message.content
//         conversation.lastMessageTime = new Date(
//           message.timestamp
//         ).toLocaleTimeString('vi-VN', {
//           hour: '2-digit',
//           minute: '2-digit'
//         })
//         // Increase unread count if not active conversation
//         if (state.activeConversation !== conversationId) {
//           conversation.unreadCount += 1
//         }
//       }
//     },
//     setSearchTerm: (state, action) => {
//       state.searchTerm = action.payload
//     },
//     setTyping: (state, action) => {
//       state.isTyping = action.payload
//     },
//     addTypingUser: (state, action) => {
//       if (!state.typingUsers.includes(action.payload)) {
//         state.typingUsers.push(action.payload)
//       }
//     },
//     removeTypingUser: (state, action) => {
//       state.typingUsers = state.typingUsers.filter(
//         (user) => user !== action.payload
//       )
//     },
//     pinMessage: (state, action) => {
//       const { conversationId, messageId } = action.payload
//       const conversation = state.conversations.find(
//         (conv) => conv.id === conversationId
//       )
//       if (conversation) {
//         const message = conversation.messages.find(
//           (msg) => msg.id === messageId
//         )
//         if (
//           message &&
//           !state.pinnedMessages.find((pinned) => pinned.messageId === messageId)
//         ) {
//           state.pinnedMessages.push({
//             conversationId,
//             messageId,
//             message: message.content,
//             timestamp: message.timestamp
//           })
//         }
//       }
//     },
//     unpinMessage: (state, action) => {
//       const { messageId } = action.payload
//       state.pinnedMessages = state.pinnedMessages.filter(
//         (pinned) => pinned.messageId !== messageId
//       )
//     },
//     updateChatTheme: (state, action) => {
//       state.chatTheme = { ...state.chatTheme, ...action.payload }
//     },
//     markMessageAsRead: (state, action) => {
//       const { conversationId, messageId } = action.payload
//       const conversation = state.conversations.find(
//         (conv) => conv.id === conversationId
//       )
//       if (conversation) {
//         const message = conversation.messages.find(
//           (msg) => msg.id === messageId
//         )
//         if (message) {
//           message.status = 'seen'
//         }
//       }
//     },
//     addReaction: (state, action) => {
//       const { conversationId, messageId, reaction } = action.payload
//       const conversation = state.conversations.find(
//         (conv) => conv.id === conversationId
//       )
//       if (conversation) {
//         const message = conversation.messages.find(
//           (msg) => msg.id === messageId
//         )
//         if (message) {
//           if (!message.reactions) {
//             message.reactions = {}
//           }
//           if (!message.reactions[reaction]) {
//             message.reactions[reaction] = []
//           }
//           if (!message.reactions[reaction].includes('me')) {
//             message.reactions[reaction].push('me')
//           }
//         }
//       }
//     },
//     removeReaction: (state, action) => {
//       const { conversationId, messageId, reaction } = action.payload
//       const conversation = state.conversations.find(
//         (conv) => conv.id === conversationId
//       )
//       if (conversation) {
//         const message = conversation.messages.find(
//           (msg) => msg.id === messageId
//         )
//         if (message && message.reactions && message.reactions[reaction]) {
//           message.reactions[reaction] = message.reactions[reaction].filter(
//             (user) => user !== 'me'
//           )
//           if (message.reactions[reaction].length === 0) {
//             delete message.reactions[reaction]
//           }
//         }
//       }
//     }
//   }
// })

// export const {
//   setActiveConversation,
//   sendMessage,
//   receiveMessage,
//   setSearchTerm,
//   setTyping,
//   addTypingUser,
//   removeTypingUser,
//   pinMessage,
//   unpinMessage,
//   updateChatTheme,
//   markMessageAsRead,
//   addReaction,
//   removeReaction
// } = chatSlice.actions

// export default chatSlice.reducer
