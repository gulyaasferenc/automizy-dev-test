import React, { useState, useEffect } from 'react'
import { Layout, Row, Col, Divider, Spin, Empty, List, Card, Typography, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
const { Title, strong } = Typography
const { Header, Content } = Layout
import StudentsForProject from './StudentsForProject'


const ByProjects = () => {
  const [projects, setProjects] = useState({
    data: null,
    complete: false,
    error: false
  })
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    setSpinner(true)
    axios.get('api/project')
      .then(res => {
        console.log(res.data)
        setSpinner(false)
        setProjects({
          data: res.data.projects,
          complete: true,
          error: false
        })
      })
      .catch(err => {
        console.error(err)
        setSpinner(false)
        setProjects({
          data: null,
          error: true,
          complete: true
        })
      })

  }, [setProjects])
  return (
    <Spin
      size="large"
      spinning={spinner}>
      {projects.data && projects.complete && projects.data.length ? <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={projects.data}
        renderItem={item => (
          <List.Item>
            <Card title={item.name}>
              <Row>
                <Col span={24}>
                  <StudentsForProject project_id={item.id} />
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      /> : <Empty />}
    </Spin>
  )
}

export default ByProjects