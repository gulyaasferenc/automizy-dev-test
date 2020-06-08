
const ManagementModel = ({
  sequelize,
  DataType
}) => {
  const { INTEGER, DATE, NOW } = DataType
  const Management = sequelize.define("management", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: {
      type: INTEGER,
      allowNull: true
    },
    project_id: {
      type: INTEGER,
      allowNull: true
    },
    createdAt: {
      type: DATE,
      defaultValue: NOW
    }
  })
  return Management;
}

export default ManagementModel