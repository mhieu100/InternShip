import {
  SendOutlined,
  LoadingOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { Button, Input, Spin, Typography, Avatar, Tooltip } from 'antd'
import { useState } from 'react'

const { Text } = Typography

interface Message {
  id: string
  content: string
  type: 'user' | 'ai'
  timestamp: Date
}

const ChatWithAI = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date()
    }

    setMessages([...messages, newMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          'This is a sample AI response. You can integrate your AI service here.',
        type: 'ai',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
        <Text className="text-lg font-semibold">Chat with AI Assistant</Text>
        <Tooltip title="Clear chat">
          <Button
            icon={<DeleteOutlined />}
            onClick={clearChat}
            disabled={messages.length === 0}
          />
        </Tooltip>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-gray-400">Start a conversation with AI</Text>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex max-w-[70%] items-start space-x-3 rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white shadow-sm'
                  }`}
                >
                  {message.type === 'ai' && (
                    <Avatar className="bg-blue-500">AI</Avatar>
                  )}
                  <div>
                    <Text
                      className={message.type === 'user' ? 'text-white' : ''}
                    >
                      {message.content}
                    </Text>
                    <div className="mt-1">
                      <Text
                        className={`text-xs ${
                          message.type === 'user'
                            ? 'text-blue-100'
                            : 'text-gray-400'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[70%] items-center space-x-3 rounded-lg bg-white p-4 shadow-sm">
                  <Avatar className="bg-blue-500">AI</Avatar>
                  <Spin
                    indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t bg-white p-6">
        <div className="flex space-x-4">
          <Input.TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type your message here..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="rounded-lg"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="flex items-center"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatWithAI
