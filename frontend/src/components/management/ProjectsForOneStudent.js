import React, { useState, useEffect } from 'react'
import { Layout, Row, Col, Divider, Spin, Empty, List, Card, Typography, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
const { Title, strong } = Typography
const { Header, Content } = Layout

const ProjectsForOneStudent = ({ student_id }) => {
  const [studentAssociations, setStudentAssociations] = useState({
    data: null,
    complete: false,
    error: false
  })

  useEffect(() => {
    axios.get(`api/management/student/${student_id}`)
      .then(res => {
        console.log(res.data)
        setStudentAssociations({
          data: res.data.managements,
          complete: true,
          error: false
        })
      })
      .catch(err => {
        console.error(err)
        setStudentAssociations({
          data: null,
          error: true,
          complete: true
        })
      })
  }, [0])

  const onClickDeleteProjectFromUser = ({ name, id }) => {
    confirm({
      title: 'Are you sure delete this project from the affected user?',
      icon: <ExclamationCircleOutlined />,
      content: name,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteProject({ name: name, id: id })
      },
      onCancel() { }
    })
  }
  // Project törlése
  const deleteProject = ({ id, name }) => {
    setSpinner(true)
    axios.delete('api/project/' + id)
      .then(res => {
        message.success('The following project has been deleted: ' + name)
        setSpinner(false)
        setTrigger(new Date().getTime())
      }
      )
      .catch(() =>
        setSpinner(false)
      )
  }

  return (
    <Row>
      {studentAssociations.complete && studentAssociations.data && studentAssociations.data.length ? <List
      span={24}
        dataSource={studentAssociations.data}
        renderItem={item => (
          <List.Item>
            <Row justify="center" span={24}>
              <Col span={20}>
                <strong>
                  {item.project_name}
                </strong>
              </Col>
              <Col span={4}>
                <Button
                  size="small"
                  type="primary"
                  onClick={({ id = item.id, name = item.project_name, }) => onClickDeleteProjectFromUser({ id: id, name: name })}>
                  Delete
                </Button>
              </Col>
            </Row>

          </List.Item>
        )}
      /> : <Empty />}
    </Row>
  )
}

export default ProjectsForOneStudent