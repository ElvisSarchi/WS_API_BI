require('dotenv').config()
const OracleDB = require('oracledb')

async function executeQuery({ user, password, query, params = [] }) {
  let connection
  try {
    const poolConfig = {
      user,
      password,
      connectString: process.env.URL_ORACLE,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 2,
      poolTimeout: 60,
    }

    const clientOpts = {
      libDir: process.env.CLIENT_ORACLEPATH,
    }
    OracleDB.initOracleClient(clientOpts)

    const pool = await OracleDB.createPool(poolConfig)
    connection = await pool.getConnection()
    const result = await connection.execute(query, params)
    const rows = result.rows.map(row => {
      const obj = {}
      result.metaData.forEach((column, index) => {
      obj[column.name] = row[index]
      })
      return obj
    })
    return rows
  } catch (error) {
    console.error('Error al ejecutar la consulta: ', error)
    return {
      rows: [],
    }
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (error) {
        console.error('Error al cerrar la conexión: ', error)
      }
    }
  }
}

module.exports = {
  executeQuery,
}