import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Switch,
  Select,
  Space,
  Divider,
  message,
  Row,
  Col,
  InputNumber,
  TimePicker,
  ColorPicker,
} from 'antd';
import {
  UploadOutlined,
  SaveOutlined,
  ReloadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const SettingSystem = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');

  const handleSave = async (values : any) => {
    setLoading(true);
    try {
      console.log('Saving settings:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Settings saved successfully!');
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info('Settings reset to default values');
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1>Settings</h1>
        <p>Manage your site configuration and preferences</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          siteName: 'My CMS Website',
          tagline: 'A powerful content management system',
          adminEmail: 'admin@example.com',
          timezone: 'UTC',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: '24',
          language: 'en',
          postsPerPage: 10,
          commentsEnabled: true,
          registrationEnabled: true,
          moderateComments: true,
          maintenanceMode: false,
          seoEnabled: true,
          analyticsEnabled: true,
          cacheEnabled: true,
          backupEnabled: true,
          primaryColor: '#1890ff',
          secondaryColor: '#52c41a',
        }}
      >
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            {/* General Settings */}
            <Card title="General Settings" className="settings-section">
              <Form.Item
                name="siteName"
                label="Site Name"
                rules={[{ required: true, message: 'Please enter site name' }]}
              >
                <Input placeholder="Enter your site name" />
              </Form.Item>

              <Form.Item
                name="tagline"
                label="Tagline"
              >
                <Input placeholder="Brief description of your site" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Site Description"
              >
                <TextArea 
                  rows={4} 
                  placeholder="Detailed description for SEO and social media"
                />
              </Form.Item>

              <Form.Item
                name="adminEmail"
                label="Admin Email"
                rules={[
                  { required: true, message: 'Please enter admin email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input placeholder="admin@example.com" />
              </Form.Item>

              <Form.Item
                name="timezone"
                label="Timezone"
              >
                <Select placeholder="Select timezone">
                  <Option value="UTC">UTC</Option>
                  <Option value="America/New_York">Eastern Time</Option>
                  <Option value="America/Chicago">Central Time</Option>
                  <Option value="America/Denver">Mountain Time</Option>
                  <Option value="America/Los_Angeles">Pacific Time</Option>
                  <Option value="Europe/London">London</Option>
                  <Option value="Europe/Paris">Paris</Option>
                  <Option value="Asia/Tokyo">Tokyo</Option>
                </Select>
              </Form.Item>
            </Card>

            {/* Media Settings */}
            <Card title="Media & Branding" className="settings-section">
              <Form.Item label="Site Logo">
                <Upload {...uploadProps} listType="picture">
                  <Button icon={<UploadOutlined />}>Upload Logo</Button>
                </Upload>
                <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                  Recommended size: 200x60px, PNG or SVG format
                </div>
              </Form.Item>

              <Form.Item label="Favicon">
                <Upload {...uploadProps} listType="picture">
                  <Button icon={<UploadOutlined />}>Upload Favicon</Button>
                </Upload>
                <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                  Recommended size: 32x32px, ICO or PNG format
                </div>
              </Form.Item>

              <Form.Item
                name="primaryColor"
                label="Primary Color"
              >
                <ColorPicker showText />
              </Form.Item>

              <Form.Item
                name="secondaryColor"
                label="Secondary Color"
              >
                <ColorPicker showText />
              </Form.Item>
            </Card>

            {/* Content Settings */}
            <Card title="Content Settings" className="settings-section">
              <Form.Item
                name="postsPerPage"
                label="Posts Per Page"
              >
                <InputNumber min={1} max={50} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="dateFormat"
                label="Date Format"
              >
                <Select>
                  <Option value="YYYY-MM-DD">2024-01-15</Option>
                  <Option value="DD/MM/YYYY">15/01/2024</Option>
                  <Option value="MM/DD/YYYY">01/15/2024</Option>
                  <Option value="DD-MM-YYYY">15-01-2024</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="timeFormat"
                label="Time Format"
              >
                <Select>
                  <Option value="24">24 Hour (14:30)</Option>
                  <Option value="12">12 Hour (2:30 PM)</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="language"
                label="Default Language"
              >
                <Select>
                  <Option value="en">English</Option>
                  <Option value="es">Spanish</Option>
                  <Option value="fr">French</Option>
                  <Option value="de">German</Option>
                  <Option value="it">Italian</Option>
                  <Option value="pt">Portuguese</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            {/* User Settings */}
            <Card title="User & Comments" className="settings-section">
              <Form.Item
                name="registrationEnabled"
                label="Allow User Registration"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="commentsEnabled"
                label="Enable Comments"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="moderateComments"
                label="Moderate Comments"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="defaultUserRole"
                label="Default User Role"
              >
                <Select>
                  <Option value="subscriber">Subscriber</Option>
                  <Option value="author">Author</Option>
                  <Option value="editor">Editor</Option>
                </Select>
              </Form.Item>
            </Card>

            {/* SEO & Analytics */}
            <Card title="SEO & Analytics" className="settings-section">
              <Form.Item
                name="seoEnabled"
                label="Enable SEO Features"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="analyticsEnabled"
                label="Enable Analytics"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="googleAnalyticsId"
                label="Google Analytics ID"
              >
                <Input placeholder="GA-XXXXXXXXX-X" />
              </Form.Item>

              <Form.Item
                name="googleSearchConsole"
                label="Google Search Console"
              >
                <Input placeholder="Verification code" />
              </Form.Item>

              <Form.Item
                name="metaKeywords"
                label="Default Meta Keywords"
              >
                <Input placeholder="keyword1, keyword2, keyword3" />
              </Form.Item>
            </Card>

            {/* System Settings */}
            <Card title="System Settings" className="settings-section">
              <Form.Item
                name="maintenanceMode"
                label="Maintenance Mode"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="cacheEnabled"
                label="Enable Caching"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="backupEnabled"
                label="Auto Backup"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="backupFrequency"
                label="Backup Frequency"
              >
                <Select>
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="maxUploadSize"
                label="Max Upload Size (MB)"
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Card>

            {/* Email Settings */}
            <Card title="Email Configuration" className="settings-section">
              <Form.Item
                name="smtpHost"
                label="SMTP Host"
              >
                <Input placeholder="smtp.example.com" />
              </Form.Item>

              <Form.Item
                name="smtpPort"
                label="SMTP Port"
              >
                <InputNumber style={{ width: '100%' }} placeholder="587" />
              </Form.Item>

              <Form.Item
                name="smtpUsername"
                label="SMTP Username"
              >
                <Input placeholder="username@example.com" />
              </Form.Item>

              <Form.Item
                name="smtpPassword"
                label="SMTP Password"
              >
                <Input.Password placeholder="Enter SMTP password" />
              </Form.Item>

              <Form.Item
                name="emailFrom"
                label="From Email"
              >
                <Input placeholder="noreply@example.com" />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Space size="large">
            <Button 
              type="default" 
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              Reset to Defaults
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
              size="large"
            >
              Save Settings
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default SettingSystem;