/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Row,
  Col,
  Input,
  Button,
  Avatar,
  Badge,
  List,
  Typography,
  Dropdown,
  Modal,
  Popover,
  Card,
  Tag,
  message,
  Space,
  Form
} from 'antd'
import {
  SendOutlined,
  AudioOutlined,
  SmileOutlined,
  PaperClipOutlined,
  SearchOutlined,
  MoreOutlined,
  ArrowLeftOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  PushpinOutlined,
  FileImageOutlined,
  FileOutlined,
  EnvironmentOutlined,
  CameraOutlined,
  MessageOutlined
} from '@ant-design/icons'

import { useAppSelector } from 'redux/hook'
import ModalConversation from 'components/modal/modal.conversation'
import { callGetUsers } from 'services/user.api'
import { IConversation, IMessage, IUser } from 'types/backend'
import {
  callGetMessages,
  callMyConversations,
  callSendMessage
} from 'services/chat.api'
import { TextAreaRef } from 'antd/es/input/TextArea'
import { io as socketIOClient, Socket } from 'socket.io-client'

const { TextArea } = Input
const { Text, Title } = Typography

const Chat = () => {
  // const dispatch = useAppDispatch()
  // const {
  //   conversations,
  //   activeConversation,
  //   searchTerm,
  //   typingUsers,
  //   pinnedMessages
  // } = useAppSelector((state) => state.chat)

  const [messageInput, setMessageInput] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showAttachmentModal, setShowAttachmentModal] = useState(false)
  const [searchInChat, setSearchInChat] = useState('')
  const [replyToMessage, setReplyToMessage] = useState(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<TextAreaRef | null>(null)

  // const activeChat = conversations.find(
  //   (conv) => conv.id === activeConversation
  // )
  // const filteredConversations = conversations.filter(
  //   (conv) =>
  //     conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  // const filteredMessages =
  //   activeChat?.messages.filter((msg) =>
  //     msg.content.toLowerCase().includes(searchInChat.toLowerCase())
  //   ) || []

  // const handleEmojiSelect = (emoji) => {
  //   setMessageInput((prev) => prev + emoji)
  //   setShowEmojiPicker(false)
  //   inputRef.current?.focus()
  // }

  // const handleReaction = (messageId, reaction) => {
  //   if (activeConversation) {
  //     dispatch(
  //       addReaction({
  //         conversationId: activeConversation,
  //         messageId,
  //         reaction
  //       })
  //     )
  //   }
  // }

  // const handlePinMessage = (messageId) => {
  //   if (activeConversation) {
  //     dispatch(
  //       pinMessage({
  //         conversationId: activeConversation,
  //         messageId
  //       })
  //     )
  //     message.success('Tin nhắn đã được ghim')
  //   }
  // }
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatLastSeen = (lastSeen: string) => {
    if (!lastSeen) return ''
    return `Hoạt động ${lastSeen}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return '✓'
      case 'delivered':
        return '✓✓'
      case 'seen':
        return '✓✓'
      default:
        return ''
    }
  }

  const emojiList = [
    '😀',
    '😂',
    '😍',
    '😢',
    '😮',
    '😡',
    '👍',
    '👎',
    '❤️',
    '🔥',
    '👏',
    '🎉'
  ]

  const attachmentOptions = [
    { key: 'image', icon: <FileImageOutlined />, label: 'Hình ảnh' },
    { key: 'file', icon: <FileOutlined />, label: 'Tệp tin' },
    { key: 'location', icon: <EnvironmentOutlined />, label: 'Vị trí' },
    { key: 'camera', icon: <CameraOutlined />, label: 'Chụp ảnh' }
  ]

  // const messageActions = (messageId) => [
  //   {
  //     key: 'reply',
  //     label: 'Trả lời',
  //     onClick: () => {
  //       const msg = activeChat.messages.find((m) => m.id === messageId)
  //       setReplyToMessage(msg)
  //       inputRef.current?.focus()
  //     }
  //   },
  //   {
  //     key: 'pin',
  //     label: 'Ghim tin nhắn',
  //     onClick: () => handlePinMessage(messageId)
  //   },
  //   {
  //     key: 'copy',
  //     label: 'Sao chép',
  //     onClick: () => {
  //       const msg = activeChat.messages.find((m) => m.id === messageId)
  //       navigator.clipboard.writeText(msg.content)
  //       message.success('Đã sao chép tin nhắn')
  //     }
  //   }
  // ]

  const reactionPopover = (messageId: number) => (
    <div className="flex gap-2 p-2">
      {['👍', '❤️', '😂', '😮', '😢', '😡'].map((emoji) => (
        <Button
          key={emoji}
          type="text"
          size="small"
          onClick={() => handleReaction(messageId, emoji)}
          className="hover:bg-gray-100"
        >
          {emoji}
        </Button>
      ))}
    </div>
  )

  const [form] = Form.useForm()
  const [conver, setConver] = useState(false)
  const [conversations, setConversations] = useState<IConversation[]>([])
  const [availableUsers, setAvailableUsers] = useState<IUser[]>([])
  const [selectConver, setSelectConver] = useState<IConversation>()
  const [messagesMap, setMessagesMap] = useState({})
  const { user } = useAppSelector((state) => state.account)
  const socketRef = useRef<Socket | null>(null)
  const loadUsers = async () => {
    try {
      const response = await callGetUsers()
      const users = response.data.result.filter((item) => item.id != user.id)
      setAvailableUsers(users)
    } catch {
      message.error('Failed to load users')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const fetchConvers = async () => {
    try {
      const response = await callMyConversations()
      if (response && response.data) {
        setConversations(response.data)
      } else {
        message.success('No have the conversation!')
      }
    } catch (error) {
      message.error('Server off!')
    }
  }

  useEffect(() => {
    fetchConvers()
    loadUsers()
  }, [])

  const handleSendMessage = async () => {
    if (!selectConver || !messageInput.trim()) return
    await callSendMessage(Number(selectConver.id), messageInput)
    setMessageInput('')
    setReplyToMessage(null)
    inputRef.current?.focus()
  }

  const handleIncomingMessage = useCallback(
    (message: string) => {
      setMessagesMap((prev) => {
        const existingMessages = prev[message.conversationId] || []
        const messageExists = existingMessages.some((msg) => {
          if (msg.id && message.id) {
            return msg.id === message.id
          }
          return false
        })

        if (!messageExists) {
          const updatedMessages = [...existingMessages, message].sort(
            (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
          )

          return {
            ...prev,
            [message.conversationId]: updatedMessages
          }
        }

        return prev
      })

      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conv) =>
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: message.message,
                lastTimestamp: new Date(message.createdDate).toLocaleString(),
                unread:
                  selectConver?.id === message.conversationId
                    ? 0
                    : (conv.unread || 0) + 1,
                modifiedDate: message.createdDate
              }
            : conv
        )

        return updatedConversations
      })
    },
    [selectConver]
  )

  const handleFetchMessage = async (conversationId: number) => {
    if (!messagesMap[conversationId]) {
      const response = await callGetMessages(conversationId)

      const sortedMessages = [...response.data].sort(
        (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
      )

      setMessagesMap((prev) => ({
        ...prev,
        [conversationId]: sortedMessages
      }))
    }

    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      )
    )
  }

  useEffect(() => {
    if (!socketRef.current) {
      const connectionUrl: string =
        'http://localhost:8099?token=' + localStorage.getItem('access_token')

      socketRef.current = socketIOClient(connectionUrl)

      socketRef.current.on('connect', () => {
        console.log('Socket connected')
      })

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected')
      })

      socketRef.current.on('message', (message) => {
        const messageObject = JSON.parse(message)
        if (messageObject?.conversationId) {
          handleIncomingMessage(messageObject)
        }
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [handleIncomingMessage])

  const currentMessages = selectConver ? messagesMap[selectConver.id] || [] : []

  const handleSelectConver = (conver: IConversation) => {
    setSelectConver(conver)
    handleFetchMessage(Number(conver.id))
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto h-full max-w-7xl px-4 py-6">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <MessageOutlined className="text-2xl text-blue-600" />
            <Title level={2} className="mb-0">
              Tin nhắn
            </Title>
          </div>
          <Space>
            <Text type="secondary">
              Kết nối và trò chuyện với bạn bè, gia đình và đồng nghiệp
            </Text>
            <Button onClick={() => setConver(true)}>
              <MessageOutlined /> New Chat
            </Button>
            <ModalConversation
              form={form}
              open={conver}
              setOpen={setConver}
              availableUsers={availableUsers}
              setSelectConver={setSelectConver}
              fetchConvers={fetchConvers}
            />
          </Space>
        </div>

        <Row gutter={[24, 24]} className="h-[calc(100vh-180px)]">
          <Col xs={24} lg={8} xl={6}>
            <Card className="h-full border-0 shadow-sm" style={{ padding: 0 }}>
              <div className="border-b border-gray-100 p-4">
                <Input
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  prefix={<SearchOutlined />}
                  // value={searchTerm}
                  // onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="mb-0"
                />
              </div>

              <List
                className="max-h-[600px] overflow-y-auto p-3"
                dataSource={conversations}
                // dataSource={filteredConversations}
                renderItem={(conversation) => (
                  <List.Item
                    className={`cursor-pointer border-0 border-b border-gray-100 px-4 py-3 hover:bg-gray-50 ${
                      selectConver === conversation
                        ? 'border-l-4 border-l-blue-500 bg-blue-50'
                        : ''
                    }`}
                    onClick={() => handleSelectConver(conversation)}
                  >
                    <List.Item.Meta
                      // avatar={
                      //   <Badge dot={conversation.isOnline} offset={[-5, 35]}>
                      //     <Avatar src={conversation.avatar} size={48}>
                      //       {conversation.name.charAt(0)}
                      //     </Avatar>
                      //   </Badge>
                      // }
                      title={
                        <div className="flex items-center justify-between px-3">
                          <Text strong className="text-sm">
                            {conversation.conversationName}
                          </Text>
                          <div className="flex items-center gap-2">
                            {/* <Text type="secondary" className="text-xs">
                              {conversation.lastMessageTime}
                            </Text>
                            {conversation.unreadCount > 0 && (
                              <Badge
                                count={conversation.unreadCount}
                                size="small"
                              />
                            )} */}

                            <Tag
                              color={
                                conversation.type === 'GROUP' ? 'blue' : 'cyan'
                              }
                            >
                              {conversation.type}
                            </Tag>
                          </div>
                        </div>
                      }
                      // description={
                      //   <div>
                      //     <Text type="secondary" className="text-xs" ellipsis>
                      //       {conversation.lastMessage}
                      //     </Text>
                      //     {!conversation.isOnline && conversation.lastSeen && (
                      //       <div>
                      //         <Text type="secondary" className="text-xs">
                      //           {formatLastSeen(conversation.lastSeen)}
                      //         </Text>
                      //       </div>
                      //     )}
                      //   </div>
                      // }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={16} xl={18}>
            <Card className="h-full border-0 p-3 shadow-sm">
              {selectConver ? (
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-gray-100 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => setSelectConver(undefined)}
                        className="lg:hidden"
                      />
                      {/* <Badge dot={selectConver.isOnline} offset={[-5, 35]}>
                        <Avatar src={selectConver.avatar} size={40}>
                          {selectConver.name.charAt(0)}
                        </Avatar>
                      </Badge> */}
                      <Avatar size={40}>
                        {selectConver.conversationName.charAt(0)}
                      </Avatar>
                      <div>
                        <Title level={5} className="mb-0">
                          {selectConver.conversationName}
                        </Title>
                        {/* <Text type="secondary" className="text-xs">
                          {selectConver.isOnline ? (
                            <span className="text-green-500">
                              Đang hoạt động
                            </span>
                          ) : (
                            formatLastSeen(selectConver.lastSeen)
                          )}
                        </Text> */}
                        {/* {typingUsers.length > 0 && (
                          <div>
                            <Text type="secondary" className="text-xs italic">
                              {typingUsers.join(', ')} đang nhập...
                            </Text>
                          </div>
                        )} */}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Tìm trong cuộc trò chuyện..."
                        prefix={<SearchOutlined />}
                        value={searchInChat}
                        onChange={(e) => setSearchInChat(e.target.value)}
                        // className="hidden w-48 md:block"
                        className="p-2"
                        size="small"
                      />
                      <Button
                        type="text"
                        icon={<PhoneOutlined />}
                        className="text-blue-600 hover:text-blue-700"
                      />
                      <Button
                        type="text"
                        icon={<VideoCameraOutlined />}
                        className="text-blue-600 hover:text-blue-700"
                      />
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: 'pinned',
                              label: 'Tin nhắn đã ghim',
                              icon: <PushpinOutlined />
                            },
                            {
                              key: 'settings',
                              label: 'Cài đặt cuộc trò chuyện',
                              icon: <SettingOutlined />
                            }
                          ]
                        }}
                        trigger={['click']}
                      >
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          className="text-blue-600 hover:text-blue-700"
                        />
                      </Dropdown>
                    </div>
                  </div>

                  {/* {pinnedMessages.filter(
                    (p) => p.conversationId === activeConversation
                  ).length > 0 && (
                    <div className="border-b border-yellow-200 bg-yellow-50 p-3">
                      <div className="flex items-center gap-2">
                        <PushpinOutlined className="text-yellow-600" />
                        <Text className="text-xs text-yellow-800">
                          {
                            pinnedMessages.filter(
                              (p) => p.conversationId === activeConversation
                            ).length
                          }{' '}
                          tin nhắn đã ghim
                        </Text>
                      </div>
                    </div>
                  )} */}

                  <div
                    className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4"
                    style={{ minHeight: '400px', maxHeight: '500px' }}
                  >
                    {currentMessages.map((msg: IMessage, index: number) => {
                      const isMyMessage = msg.me
                      // const showAvatar =
                      //   !isMyMessage &&
                      //   (index === 0 ||
                      //     selectConver.messages[index - 1]?.senderId !==
                      //       msg.sender.id)

                      const showAvatar =
                        !isMyMessage &&
                        (index === 0 ||
                          selectConver.participants[0].id !== msg.sender.id)

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${
                            isMyMessage ? 'justify-end' : 'justify-start'
                          } group`}
                        >
                          {!isMyMessage && (
                            <div className="mr-2 w-8">
                              {showAvatar && (
                                // <Avatar src={selectConver.avatar} size={32}>
                                //   {msg.senderName.charAt(0)}
                                // </Avatar>
                                <Avatar size={32}>
                                  {msg.sender.name.charAt(0)}
                                </Avatar>
                              )}
                            </div>
                          )}

                          <div
                            className={`max-w-xs lg:max-w-md ${
                              isMyMessage ? 'ml-auto' : ''
                            }`}
                          >
                            {!isMyMessage && showAvatar && (
                              <Text className="mb-1 ml-2 block text-xs text-gray-500">
                                {msg.sender.name}
                              </Text>
                            )}

                            {/* {msg.replyTo && (
                              <div className="mb-1 rounded border-l-4 border-blue-400 bg-gray-100 p-2 text-xs">
                                <Text type="secondary">
                                  Trả lời:{' '}
                                  {
                                    selectConver.messages.find(
                                      (m) => m.id === msg.replyTo
                                    )?.content
                                  }
                                </Text>
                              </div>
                            )} */}

                            <Dropdown
                              // menu={{ items: messageActions(msg.id) }}
                              trigger={['contextMenu']}
                            >
                              <div
                                className={`relative rounded-lg p-3 ${
                                  isMyMessage
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-200 bg-white'
                                } shadow-sm transition-shadow hover:shadow-md`}
                              >
                                <div>{msg.message}</div>

                                {/* <div
                                  className={`mt-1 flex items-center justify-between text-xs ${
                                    isMyMessage
                                      ? 'text-blue-100'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  <span>{formatTime(msg.timestamp)}</span>
                                  {isMyMessage && (
                                    <span className="ml-2">
                                      {getStatusIcon(msg.status)}
                                    </span>
                                  )}
                                </div> */}

                                {/* {msg.reactions &&
                                  Object.keys(msg.reactions).length > 0 && (
                                    <div className="mt-2 flex gap-1">
                                      {Object.entries(msg.reactions).map(
                                        ([emoji, users]) => (
                                          <Tag
                                            key={emoji}
                                            size="small"
                                            className="cursor-pointer"
                                            onClick={() =>
                                              handleReaction(msg.id, emoji)
                                            }
                                          >
                                            {emoji} {users.length}
                                          </Tag>
                                        )
                                      )}
                                    </div>
                                  )} */}

                                {/* <div className="absolute -top-2 right-0 hidden rounded-lg border bg-white shadow-lg group-hover:flex">
                                  <Popover
                                    content={reactionPopover(msg.id)}
                                    trigger="click"
                                    placement="top"
                                  >
                                    <Button
                                      type="text"
                                      size="small"
                                      icon={<SmileOutlined />}
                                    />
                                  </Popover>
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<MoreOutlined />}
                                    onClick={() => {
                                      // Show more options
                                    }}
                                  />
                                </div> */}
                              </div>
                            </Dropdown>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-gray-100 bg-white p-4">
                    {/* {replyToMessage && (
                      <div className="mb-3 flex items-center justify-between rounded border-l-4 border-blue-400 bg-blue-50 p-3">
                        <div>
                          <Text type="secondary" className="text-xs">
                            Trả lời {replyToMessage.senderName}
                          </Text>
                          <div className="text-sm">
                            {replyToMessage.content}
                          </div>
                        </div>
                        <Button
                          type="text"
                          size="small"
                          onClick={() => setReplyToMessage(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </Button>
                      </div>
                    )} */}

                    <div className="flex items-end gap-2">
                      <Dropdown
                        menu={{
                          items: attachmentOptions.map((option) => ({
                            key: option.key,
                            label: option.label,
                            icon: option.icon,
                            onClick: () => setShowAttachmentModal(true)
                          }))
                        }}
                        trigger={['click']}
                      >
                        <Button
                          type="text"
                          icon={<PaperClipOutlined />}
                          className="text-gray-600 hover:text-blue-600"
                        />
                      </Dropdown>

                      <div className="relative flex-1">
                        <TextArea
                          ref={inputRef}
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Nhập tin nhắn..."
                          autoSize={{ minRows: 1, maxRows: 4 }}
                          className="resize-none border-gray-300 focus:border-blue-500"
                        />
                      </div>

                      {/* <Popover
                        content={
                          <div className="grid w-64 grid-cols-6 gap-2 p-2">
                            {emojiList.map((emoji) => (
                              <Button
                                key={emoji}
                                type="text"
                                size="small"
                                onClick={() => handleEmojiSelect(emoji)}
                                className="hover:bg-blue-50"
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        }
                        trigger="click"
                        open={showEmojiPicker}
                        onOpenChange={setShowEmojiPicker}
                      >
                        <Button
                          type="text"
                          icon={<SmileOutlined />}
                          className="text-gray-600 hover:text-blue-600"
                        />
                      </Popover> */}

                      <Button
                        type="text"
                        icon={<AudioOutlined />}
                        className={
                          isRecording
                            ? 'text-red-500'
                            : 'text-gray-600 hover:text-blue-600'
                        }
                        onClick={() => setIsRecording(!isRecording)}
                      />

                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="border-blue-600 bg-blue-600 hover:bg-blue-700"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="mb-4 text-6xl">💬</div>
                    <Title level={3} type="secondary">
                      Chọn một cuộc trò chuyện để bắt đầu
                    </Title>
                    <Text type="secondary">
                      Chọn từ danh sách bên trái hoặc bắt đầu cuộc trò chuyện
                      mới
                    </Text>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        title="Đính kèm tệp"
        open={showAttachmentModal}
        onCancel={() => setShowAttachmentModal(false)}
        footer={null}
        className="top-20"
      >
        <div className="grid grid-cols-2 gap-4">
          {attachmentOptions.map((option) => (
            <Card
              key={option.key}
              hoverable
              className="border-gray-200 text-center transition-all hover:border-blue-400 hover:shadow-md"
              onClick={() => {
                message.info(`Chức năng ${option.label} sẽ được phát triển`)
                setShowAttachmentModal(false)
              }}
            >
              <div className="mb-2 text-2xl text-blue-600">{option.icon}</div>
              <div className="text-gray-700">{option.label}</div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default Chat
