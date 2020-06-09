import React from 'react'
import { Layout, Row, Col, Divider, Spin, Empty, List, Typography, Button, Modal, message } from 'antd'
const { Title } = Typography
const { Header, Content } = Layout

const Management=()=>{
    return (
      <Layout>
        <Header className="header">
          <Row>
            <Col span={18}><Title>Management Handler</Title></Col>
            <Col span={6}>
              <Button>By Students</Button>
              <Divider type="vertical" />
              <Button>By Projects</Button>
            </Col>
          </Row>
            
        </Header>
        <Content className="content">
          Write frontend code here
        </Content>
      </Layout>
    )
}



export default Management