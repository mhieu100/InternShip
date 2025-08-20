/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Key, useState } from 'react'
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Card,
  Popconfirm,
  message,
  Avatar,
  Tooltip
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Search } = Input
const { Option } = Select

const ManagementPost = () => {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | Key[]>([])

  // Sample posts data
  const [posts, setPosts] = useState([
    {
      key: '1',
      id: 1,
      title: 'Getting Started with React Hooks',
      author: {
        name: 'John Doe',
        avatar: null
      },
      status: 'published',
      category: 'Technology',
      tags: ['React', 'JavaScript', 'Frontend'],
      views: 1250,
      comments: 23,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      key: '2',
      id: 2,
      title: 'Advanced CSS Grid Techniques',
      author: {
        name: 'Jane Smith',
        avatar: null
      },
      status: 'draft',
      category: 'Design',
      tags: ['CSS', 'Grid', 'Layout'],
      views: 0,
      comments: 0,
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14'
    },
    {
      key: '3',
      id: 3,
      title: 'Building RESTful APIs with Node.js',
      author: {
        name: 'Mike Johnson',
        avatar: null
      },
      status: 'published',
      category: 'Backend',
      tags: ['Node.js', 'API', 'Backend'],
      views: 890,
      comments: 15,
      createdAt: '2024-01-13',
      updatedAt: '2024-01-13'
    },
    {
      key: '4',
      id: 4,
      title: 'Understanding Database Optimization',
      author: {
        name: 'Sarah Wilson',
        avatar: null
      },
      status: 'scheduled',
      category: 'Database',
      tags: ['Database', 'Performance', 'SQL'],
      views: 0,
      comments: 0,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12'
    }
  ])

  const handleDelete = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id))
    message.success('Post deleted successfully')
  }

  const handleBulkDelete = () => {
    setPosts(posts.filter((post) => !selectedRowKeys.includes(post.key)))
    setSelectedRowKeys([])
    message.success(`${selectedRowKeys.length} posts deleted successfully`)
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      published: 'green',
      draft: 'orange',
      scheduled: 'blue',
      archived: 'default'
    }
    return colors[status] || 'default'
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.id} | Category: {record.category}
          </div>
        </div>
      )
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: (author: { name: string; avatar: string | null }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={author.avatar} style={{ marginRight: 8 }}>
            {author.name.charAt(0)}
          </Avatar>
          {author.name}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <div>
          {tags.slice(0, 2).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {tags.length > 2 && (
            <Tooltip title={tags.slice(2).join(', ')}>
              <Tag>+{tags.length - 2}</Tag>
            </Tooltip>
          )}
        </div>
      )
    },
    {
      title: 'Stats',
      key: 'stats',
      render: (_: any, record: any) => (
        <div style={{ fontSize: '12px' }}>
          <div>
            <EyeOutlined /> {record.views} views
          </div>
          <div style={{ marginTop: 2 }}>💬 {record.comments} comments</div>
        </div>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="View">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Edit">
            <Link to={`/posts/edit/${record.id}`}>
              <Button type="text" icon={<EditOutlined />} size="small" />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this post?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24
        }}
      >
        <h1>Post Management</h1>
        <Link to="/admin/editor-post">
          <Button type="primary" icon={<PlusOutlined />}>
            New Post
          </Button>
        </Link>
      </div>

      <Card>
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap'
          }}
        >
          <Search
            placeholder="Search posts..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            prefix={<FilterOutlined />}
          >
            <Option value="all">All Status</Option>
            <Option value="published">Published</Option>
            <Option value="draft">Draft</Option>
            <Option value="scheduled">Scheduled</Option>
            <Option value="archived">Archived</Option>
          </Select>
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`Are you sure you want to delete ${selectedRowKeys.length} selected posts?`}
              onConfirm={handleBulkDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete Selected ({selectedRowKeys.length})</Button>
            </Popconfirm>
          )}
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredPosts}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} posts`
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  )
}

export default ManagementPost
