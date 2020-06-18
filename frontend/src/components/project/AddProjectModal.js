/**
 * Form to create/edit projects
 * 
 * @param item: {object}
 * @param onClickCancel: {function}
 * @param onDone: {function}
 */

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
  item,
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
  // Save project
  const saveProject = ({ name, description }) => {
    if (item && item.id) {
      axios.put(`api/project/${item.id}`, {
        'name': name,
        'description': description
      })
        .then(() => {
          form.resetFields()
          onDone({ name: name })
        })
        .catch((err) => {
          console.log(error)
        })
    } else {
      axios.post('api/project', {
        'name': name,
        'description': description
      })
        .then(() => {
          form.resetFields()
          onDone({ name: name })
        })
        .catch((err) => {
          console.log(error)
        })
    }

  }
  
  return (
    <Modal
      visible={true}
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
        initialValues={{
          name: item && item.name ? item.name : null,
          description: item && item.description ? item.description : null
        }}
      >
        <Form.Item
          label={'Name'}
          name="name"
          rules={[{ required: true, message: 'Please type project name!' }]}
        >
          <Input
            autoComplete='off'
            placeholder="Name"
            />
        </Form.Item>
        <Form.Item
          label={'Description'}
          name="description"
          rules={[{ required: true, message: 'Please type project description!' }]}
        >
          <TextArea
            autoComplete='off'
            placeholder="Description"
            />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddProjectModal