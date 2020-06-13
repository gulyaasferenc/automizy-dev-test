import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Button,
  Modal,
  Form,
  Input
} from 'antd'

const AddStudentModal = ({
  visible,
  onClickCancel,
  onDone
}) => {
  const [form] = Form.useForm()

  const onClickSave = () => {
    form
      .validateFields()
      .then(values => {
        saveStudent({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email
        })
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }
  // Tanuló mentése
  const saveStudent = ({ first_name, last_name, email }) => {
    axios.post('api/student', {
      'first_name': first_name,
      'last_name': last_name,
      'email': email
    })
      .then(() => {
        form.resetFields()
        onDone({ name: first_name + ' ' + last_name })
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
      title="Add new student"
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
          label={'First name'}
          name="first_name"
          rules={[{ required: true, message: 'Please type student first name!' }]}
        >
          <Input
            autoComplete='off'
            placeholder="First name" />
        </Form.Item>
        <Form.Item
          label={'Last name'}
          name="last_name"
          rules={[{ required: true, message: 'Please type student last name!' }]}
        >
          <Input
            autoComplete='off'
            placeholder="Last name" />
        </Form.Item>
        <Form.Item
          label={'Email address'}
          name="email"
          rules={[{ required: true, message: 'Please type student email address!' }]}
        >
          <Input
            autoComplete='off'
            placeholder="Email address" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddStudentModal