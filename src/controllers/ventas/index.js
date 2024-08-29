import { executeQuery } from "../../DB"

export async function getVentas() {
  try {
    const sql = `
    select a.BI_FECHA AS FECHA,a.BI_ANIO AS ANIO,m.NOMBRE AS MES,b.TIPDOC_NOMBRE AS TIPODOCUMENTO,a.BOD_CODIGO,k.BOD_NOMBRE AS BODEGA,a.CLI_CODIGO,d.CLI_NOMBRE AS CLIENTE,
    d.GRU_CODIGO,f.GRU_NOMBRE AS GRUPOCLIENTE,h.PROV_NOMBRE AS PROVINCIA,i.CAN_NOMBRE AS CANTON,j.PARR_NOMBRE AS PARROQUIA,a.DETFAC_CODIGO AS CODIGOPRODUCTO,
    a.DETFAC_DESCRIPCION AS DESCRIPCION,a.GRUP_CODIGO,g.GRUP_NOMBRE AS GRUPOPRODUCTO,a.DETFAC_CANTIDAD AS CANTIDAD ,a.BI_TOTALCOSTO AS TOTALCOSTO,a.BI_TOTALVNTA AS TOTALVENTA,
    BI_TOTALVNTASIVA,a.VEN_CODIGO,e.VEN_NOMBRE AS VENDEDOR
    from bi_tmp_ventas a,bi_maetipdoc b, bi_maecliente d,bi_maevendedor e,bi_maegrupo f,bi_maegrupoart g,bi_maeprovincia h,bi_maecanton i,bi_maeparroquia j,bi_maebodega k,BI_MAEMESES m
    --,bi_maezona c,bi_maeciudad l
    where a.BOD_CODIGO = k.BOD_CODIGO and a.GRUP_CODIGO = g.GRUP_CODIGO 
    and a.VEN_CODIGO = e.VEN_CODIGO and a.BI_TIPO = b.TIPDOC_CODIGO
    and a.CLI_CODIGO = d.CLI_CODIGO and d.CAN_CODIGO = i.CAN_CODIGO
    and d.GRU_CODIGO = f.GRU_CODIGO and d.PARR_CODIGO = j.PARR_CODIGO
    and d.PROV_CODIGO = h.PROV_CODIGO and a.BI_MES = m.MES
    `
    const { rows } = await executeQuery(sql)
    return rows
  } catch (error) {
    console.error("Error en getVentas: ", error)
    return []
  }
}