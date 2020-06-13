import React, { useState } from 'react'
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  message,
} from 'antd'
const { Title } = Typography
const { Header, Content } = Layout
import ListProject from '../../components/project/ListProject'
import AddProjectModal from '../../components/project/AddProjectModal'

const Project = () => {
  const [reloadListTrigger, setReloadListTrigger] = useState(null)
  const [showModal, setShowModal] = useState(false)
  // Új project hozzáadása gombra kattintás
  const onClickAddNewProject = () => {
    setShowModal(true)
  }
  const onClickCancel = () => {
    setShowModal(false)
  }
  const onDone = ({ name }) => {
    setShowModal(false)
    setReloadListTrigger(new Date().getTime())
    message.success('The following project has been saved: ' + name)
  }
  return (
    <Layout>
      <Header className="header">
        <Row>
          <Col span={22}>
            <Title>Project Handler</Title>
          </Col>
          <Col span={2}>
            <Button
              type="primary"
              onClick={onClickAddNewProject}>
              Add new Project
              </Button>
          </Col>
        </Row>
      </Header>
      <Content className="content">
        <ListProject reloadListTrigger={reloadListTrigger} />
        <AddProjectModal visible={showModal} onClickCancel={onClickCancel} onDone={onDone} />
      </Content>
    </Layout>
  )
}

export default Project