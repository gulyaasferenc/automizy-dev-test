/**
 * Show all students which belong to a specific project
 */

import React, { useState, useEffect } from 'react'
import { Tooltip, Row, Col, Spin, Empty, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal

const StudentsForProject = ({ project_id, onCancel }) => {
  const [projectAssociations, setProjectAssociations] = useState({
    data: null,
    complete: false,
    error: false
  })

  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    setSpinner(true)
    axios.get(`api/management/project/${project_id}`)
      .then(res => {
        setSpinner(false)
        setProjectAssociations({
          data: res.data.managements,
          complete: true,
          error: false
        })
      })
      .catch(err => {
        setSpinner(false)
        console.log(err)
        setProjectAssociations({
          data: null,
          error: true,
          complete: true
        })
      })
  }, [0, project_id])

  const onClickDeleteStudentfromProject = ({ name, id }) => {
    confirm({
      title: 'Are you sure delete this student from the affected project?',
      icon: <ExclamationCircleOutlined />,
      content: name,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteStudent({ name: name, id: id })
      },
      onCancel() { onCancel }
    })
  }
  // Delete student from the association list
  const deleteStudent = ({ id, name }) => {
    axios.delete('api/management/' + id)
      .then(res => {
        message.success('The following project has been deleted: ' + name)
        onCancel()
      }
      )
      .catch((error) =>
        console.log(error)
      )
  }

  return (
    <Row>
      <Spin
        size="small"
        spinning={spinner}
        style={{ margin: 'auto' }}
      />
      {projectAssociations.complete && projectAssociations.error ?
        <div>Something went wrong!</div>
        : projectAssociations.complete && projectAssociations.data && projectAssociations.data.length ?
          projectAssociations.data.map((item, i) => {
            return (
              <Row key={i} className="card-list" justify="space-between" span={24} style={{ marginBottom: '1rem' }}>
                <Col span={18}>
                  <Tooltip title={item.email}>
                    <div><strong>{`${item.first_name} ${item.last_name}`}</strong></div>
                  </Tooltip>
                </Col>
                <Col span={6}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={({ id = item.id, name = `${item.first_name} ${item.last_name}`, }) => onClickDeleteStudentfromProject({ id: id, name: name })}>
                    Delete
                  </Button>
                </Col>
              </Row>
            )
          })
          : <Empty />
      }
    </Row>
  )
}

export default StudentsForProject