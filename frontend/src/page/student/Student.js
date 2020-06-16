import React, { useState } from 'react'
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  message
} from 'antd'
const { Title } = Typography
const { Header, Content } = Layout
import ListStudent from '../../components/student/ListStudent'
import AddStudentModal from '../../components/student/AddStudentModal'
import "../../layout/Layout.css"

const Student = () => {
  const [reloadListTrigger, setReloadListTrigger] = useState(null)
  const [showModal, setShowModal] = useState(false)
  // Új tanuló hozzáadása gombra kattintás
  const onClickAddNewStudent = () => {
    setShowModal(true)
  }
  const onClickCancel = () => {
    setShowModal(false)
  }
  const onDone = ({ name }) => {
    setShowModal(false)
    setReloadListTrigger(new Date().getTime())
    message.success('The following student has been saved: ' + name)
  }
  return (
    <Layout>
      <Header className="header">
        <Row>
          <Col span={22}>
            <Title>Student Handler</Title>
          </Col>
          <Col span={2}>
            <Button
              type="primary"
              onClick={onClickAddNewStudent}>
              Add new Student
            </Button>
          </Col>
        </Row>
      </Header>
      <Content className="content">
        <ListStudent reloadListTrigger={reloadListTrigger} />
        { showModal ? <AddStudentModal item={null} onClickCancel={onClickCancel} onDone={onDone} /> : null}
      </Content>
    </Layout>
  )
}

export default Student