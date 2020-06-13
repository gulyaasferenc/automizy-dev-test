import React from 'react'
import axios from 'axios'
import {
  Button,
  Modal,
  Form,
  Input
} from 'antd'
const { TextArea } = Input

const AddProjectModal = ({
  visible,
  onClickCancel,
  onDone
}) => {
  const [form] = Form.useForm()

  const onClickSave = () => {
    form
      .validateFields()
      .then(values => {
        saveProject({
          name: values.name,
          description: values.description
        })
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }
  // Project mentése
  const saveProject = ({ name, description }) => {
    axios.post('api/project', {
      'name': name,
      'description': description
    })
      .then(() => {
        form.resetFields()
        onDone({ name: name })
      })
      .catch((err) => {
        if (err.response.status === 409) {
          setDuplicationErrorMessage({ name: err.response.data.error })
        } else {
        }
      })
  }
  const setDuplicationErrorMessage = ({ name }) => {
    console.log(name)
    form.setFields([
      {
        name: Object.keys(name)[0],
        errors: ["Alredy exists"]
      }
    ])
  }
  return (
    <Modal
      visible={visible}
      title="Add new project"
      onCancel={onClickCancel}
      footer={[
        <Button key="cancel" onClick={onClickCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={onClickSave}>
          Save
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label={'Name'}
          name="name"
          rules={[{ required: true, message: 'Please type project name!' }]}
        >
          <Input
            autoComplete='off'
            placeholder="Name" />
        </Form.Item>
        <Form.Item
          label={'Description'}
          name="description"
          rules={[{ required: true, message: 'Please type project description!' }]}
        >
          <TextArea
            autoComplete='off'
            placeholder="Description" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddProjectModal