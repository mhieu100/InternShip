/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Upload,
  Space,
  Tag,
  message,
  Row,
  Col,
  Switch,
  DatePicker
} from 'antd'
import {
  SaveOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { Editor } from '@tinymce/tinymce-react'
import { IPost } from 'types/backend'

const { Option } = Select
const { TextArea } = Input

const EditorPost = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [inputTag, setInputTag] = useState('')
  const [featuredImage, setFeaturedImage] = useState(null)

  const isEditing = Boolean(id)

  useEffect(() => {
    if (isEditing) {
      // Load post data for editing
      loadPostData(Number(id))
    }
  }, [id, isEditing])

  const loadPostData = (postId: number) => {
    // Simulate loading post data
    const mockPost: IPost = {
      id: postId,
      title: 'Sample Post Title',
      content: '<p>This is sample content for editing...</p>',
      excerpt: 'This is a sample excerpt',
      category: 'technology',
      tags: ['React', 'JavaScript'],
      status: 'draft',
      featuredImage: null,
      publishDate: null,
      seoTitle: 'Sample SEO Title',
      seoDescription: 'Sample SEO description'
    }

    form.setFieldsValue(mockPost)
    setContent(mockPost.content)
    setTags(mockPost.tags)
  }

  const handleSave = async (values: any) => {
    setLoading(true)
    try {
      const postData = {
        ...values,
        content,
        tags,
        featuredImage
      }

      console.log('Saving post:', postData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      message.success(
        isEditing ? 'Post updated successfully!' : 'Post created successfully!'
      )
      navigate(-1)
    } catch (error) {
      message.error('Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    message.info('Preview functionality would open in a new tab')
  }

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag])
      setInputTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text'
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        setFeaturedImage(info.file.response.url)
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back to Posts
        </Button>
        <h1>{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          status: 'draft',
          allowComments: true
        }}
      >
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card title="Post Content" style={{ marginBottom: 24 }}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter post title' }]}
              >
                <Input size="large" placeholder="Enter post title..." />
              </Form.Item>

              <Form.Item name="excerpt" label="Excerpt">
                <TextArea
                  rows={3}
                  placeholder="Brief description of the post..."
                />
              </Form.Item>

              <Form.Item label="Content">
                <Editor
                  apiKey="lm42ettpzt5rmhy7wc9fkxtx7hrs4ztlwhw0bs8ng1npboo1"
                  value={content}
                  onEditorChange={setContent}
                  init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help'
                  }}
                />
              </Form.Item>
            </Card>

            <Card title="SEO Settings">
              <Form.Item name="seoTitle" label="SEO Title">
                <Input placeholder="SEO optimized title..." />
              </Form.Item>

              <Form.Item name="seoDescription" label="SEO Description">
                <TextArea
                  rows={3}
                  placeholder="SEO meta description..."
                  showCount
                  maxLength={160}
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Publish Settings" style={{ marginBottom: 24 }}>
              <Form.Item name="status" label="Status">
                <Select>
                  <Option value="draft">Draft</Option>
                  <Option value="published">Published</Option>
                  <Option value="scheduled">Scheduled</Option>
                </Select>
              </Form.Item>

              <Form.Item name="publishDate" label="Publish Date">
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder="Select publish date"
                />
              </Form.Item>

              <Form.Item
                name="allowComments"
                label="Allow Comments"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  {isEditing ? 'Update' : 'Save'}
                </Button>
                <Button icon={<EyeOutlined />} onClick={handlePreview}>
                  Preview
                </Button>
              </Space>
            </Card>

            <Card title="Categories & Tags" style={{ marginBottom: 24 }}>
              <Form.Item
                name="category"
                label="Category"
                rules={[
                  { required: true, message: 'Please select a category' }
                ]}
              >
                <Select placeholder="Select category">
                  <Option value="technology">Technology</Option>
                  <Option value="design">Design</Option>
                  <Option value="business">Business</Option>
                  <Option value="lifestyle">Lifestyle</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Tags">
                <div style={{ marginBottom: 8 }}>
                  {tags.map((tag) => (
                    <Tag
                      key={tag}
                      closable
                      onClose={() => handleRemoveTag(tag)}
                      style={{ marginBottom: 4 }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
                <Input.Group compact>
                  <Input
                    style={{ width: 'calc(100% - 32px)' }}
                    value={inputTag}
                    onChange={(e) => setInputTag(e.target.value)}
                    onPressEnter={handleAddTag}
                    placeholder="Add tag..."
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddTag}
                  />
                </Input.Group>
              </Form.Item>
            </Card>

            <Card title="Featured Image">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
              {featuredImage && (
                <div style={{ marginTop: 16 }}>
                  <img
                    src={featuredImage}
                    alt="Featured"
                    style={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default EditorPost
