import React, { useState, useEffect } from 'react'
import { Layout, Row, Col, Divider, Spin, Empty, List, Card, Typography, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
const { Title, strong } = Typography
const { Header, Content } = Layout
import ByStudents from '../../components/management/ByStudents'
import ByProjects from '../../components/management/ByProjects'
import AssociateModal from '../../components/management/AssociateModal'

const Management = () => {

  const [activeMenu, setActiveMenu] = useState('student')
  const [modalVisible, setModalVisible] = useState(false)
  const onStudentClick = () => {
    setActiveMenu('student')
  }
  const onProjectClick = () => {
    setActiveMenu('project')
  }

  return (
    <Layout>
      <Header className="header">
        <Row>
          <Col span={18}><Title>Handle Students and Projects Associations</Title></Col>
          <Col span={6}>
            <Button type={activeMenu === "student" ? "primary" : "default"} onClick={onStudentClick}>By Students</Button>
            <Divider type="vertical" />
            <Button type={activeMenu === "project" ? "primary" : "default"} onClick={onProjectClick}>By Projects</Button>
          </Col>
        </Row>
      </Header>
      <Content className="content">
        {activeMenu === 'student' ? <ByStudents /> : <ByProjects />}
        <AssociateModal visible={modalVisible} />
      </Content>
    </Layout>
  )
}

export default Management