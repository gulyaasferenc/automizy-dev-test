import React, { useState, useEffect } from 'react'
import { Layout, Row, Col, Spin, Empty, List, Button, Modal, message } from 'antd'
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
  }, [0])

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
  // Project törlése
  const deleteStudent = ({ id, name }) => {
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
        {projectAssociations.complete && projectAssociations.error ?
          <div>Something went wrong!</div>
          : projectAssociations.complete && projectAssociations.data && projectAssociations.data.length ? <List
              dataSource={projectAssociations.data}
              renderItem={item => (
                <List.Item>
                  <Row className="card-list" justify="center" span={24}>
                    <Col span={20}>
                      <strong>
                        {`${item.first_name} ${item.last_name}`}
                      </strong>
                    </Col>
                    <Col span={4}>
                      <Button
                        size="small"
                        type="primary"
                        onClick={({ id = item.id, name = `${item.first_name} ${item.last_name}`, }) => onClickDeleteStudentfromProject({ id: id, name: name })}>
                        Delete
                </Button>
                    </Col>
                  </Row>

                </List.Item>
              )}
            /> : <Empty />
          }
      </Spin>

    </Row>
  )
}

export default StudentsForProject