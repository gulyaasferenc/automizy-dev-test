import React, { useState, useEffect } from 'react'
import { Layout, Row, Col, Divider, Spin, Empty, List, Card, Typography, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
const { Title, strong } = Typography
const { Header, Content } = Layout
import ProjectsForOneStudent from './ProjectsForOneStudent'


const ByStudents = () => {
  const [students, setStudents] = useState({
    data: null,
    complete: false,
    error: false
  })
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    setSpinner(true)
    axios.get('api/student')
      .then(res => {
        console.log(res.data)
        setSpinner(false)
        setStudents({
          data: res.data.students,
          complete: true,
          error: false
        })
      })
      .catch(err => {
        console.error(err)
        setSpinner(false)
        setStudents({
          data: null,
          error: true,
          complete: true
        })
      })

  }, [setStudents])
  return (
    <Spin
      size="large"
      spinning={spinner}>
      {students.data && students.complete && students.data.length ? <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={students.data}
        renderItem={item => (
          <List.Item>
            <Card title={`${item.first_name} ${item.last_name}`}>
              <ProjectsForOneStudent student_id={item.id} />
            </Card>
          </List.Item>
        )}
      /> : <Empty />}
    </Spin>
  )
}

export default ByStudents