import React, { useState } from 'react'
import { Layout, Row, Col, Divider, Typography, Button} from 'antd'
const { Title } = Typography
const { Header, Content } = Layout
import ByStudents from '../../components/management/ByStudents'
import ByProjects from '../../components/management/ByProjects'

const Management = () => {

  const [activeMenu, setActiveMenu] = useState('student')
  const onSelectClick = (select) => {
    setActiveMenu(select)
    setTimeout( () => {
      console.log(activeMenu)
    }, 1200)
  }

  return (
    <Layout>
      <Header className="header">
        <Row>
          <Col span={18}><Title>Handle Students and Projects Associations</Title></Col>
          <Col span={6}>
            <Button type={activeMenu === "student" ? "primary" : "default"} onClick={() => onSelectClick('student')}>By Students</Button>
            <Divider type="vertical" />
            <Button type={activeMenu === "project" ? "primary" : "default"} onClick={() => onSelectClick('project')}>By Projects</Button>
          </Col>
        </Row>
      </Header>
      <Content className="content">
        {activeMenu === 'student' ? <ByStudents /> : <ByProjects />}
      </Content>
    </Layout>
  )
}

export default Management