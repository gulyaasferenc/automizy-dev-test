import React, { useState, useEffect } from 'react'
import { Layout, Row, Col, Divider, Spin, Empty, List, Card, Typography, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
const { Title, strong } = Typography
const { Header, Content } = Layout

const ProjectsForOneStudent = ({ student_id, onCancel }) => {
  const [studentAssociations, setStudentAssociations] = useState({
    data: null,
    complete: false,
    error: false
  })

  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    setSpinner(true)
    axios.get(`api/management/student/${student_id}`)
      .then(res => {
        console.log(res.data)
        setStudentAssociations({
          data: res.data.managements,
          complete: true,
          error: false
        })
        setSpinner(false)
      })
      .catch(err => {
        setSpinner(false)
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
      onCancel() { onCancel }
    })
  }
  // Project törlése
  const deleteProject = ({ id, name }) => {
    axios.delete('api/management/' + id)
      .then(res => {
        message.success('The following project has been deleted: ' + name)
        onCancel()
      }
      )
      .catch((error) =>
        console.error(error)
      )
  }

  return (
    <Row>
      <Spin
        size="small"
        spinning={spinner}
      >
        {studentAssociations.complete && studentAssociations.data.error ?
          <div>Something went wrong!</div>
          : studentAssociations.complete && studentAssociations.data && studentAssociations.data.length ? <List
            dataSource={studentAssociations.data}
            renderItem={item => (
              <List.Item>
                <Row className="card-list" justify="center" span={24}>
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
      </Spin>

    </Row>
  )
}

export default ProjectsForOneStudent