/**
 * Show all projects which belong to a specific student
 */

import React, { useState, useEffect } from 'react'
import { Row, Col, Spin, Empty, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal

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
  }, [0, student_id])

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
  // delete project from the association list
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
    <Row span={24} justify="space-between">
      <Spin
        size="small"
        spinning={spinner}
        span={24}
        style={{ margin: 'auto' }}
      />
      {studentAssociations.complete && studentAssociations.data.error ?
        <div>Something went wrong!</div>
        : studentAssociations.complete && studentAssociations.data && studentAssociations.data.length ?
          studentAssociations.data.map((item, i) => {
            return (
              <Row key={i} className="card-list" justify="space-between" span={24} style={{ marginBottom: '1rem' }}>
                <Col span={18}>
                  <strong>
                    {item.project_name}
                  </strong>
                </Col>
                <Col span={6}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={({ id = item.id, name = item.project_name, }) => onClickDeleteProjectFromUser({ id: id, name: name })}>
                    Delete
                </Button>
                </Col>
              </Row>
            )
          })
          : <Empty />}
    </Row>
  )
}

export default ProjectsForOneStudent