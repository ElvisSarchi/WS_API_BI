import OracleDB from 'oracledb'
import 'dotenv/config'

OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT
OracleDB.autoCommit = true

let pool

export async function createPool(user, password) {
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

  try {
    pool = await OracleDB.createPool(poolConfig)
    console.log('Conexión exitosa a Oracle')
  } catch (error) {
    console.error('Error al conectar con ORACLE')
    console.error(error)
  }
}

export async function checkConnection() {
  try {
    console.log(poolConfig)
    pool = await OracleDB.createPool(poolConfig)
    console.log('Conexión exitosa a Oracle')
  } catch (error) {
    console.error('Error al conectar con ORACLE')
    console.error(error)
  }
}

//create function to execute query
export async function executeQuery(query, params = []) {
  let connection
  try {
    connection = await pool.getConnection()
    const result = await connection.execute(query, params)
    return result
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
        //console.error("Error al cerrar la conexión: ", error);
      }
    }
  }
}

// Ejemplo de uso:
createPool(process.env.USER_ORACLE, process.env.PASSWORD_ORACLE)
checkConnection()
