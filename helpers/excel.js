// const tempy = require('tempy')
const Excel = require('exceljs')

const defaultWorkbookOptions = {
  creator: 'ERP - i9xp',
  created: new Date(),
  modified: new Date()
}
const defaultWorksheetOptions = {
  pageSetup: {
    verticalCentered: true,
    horizontalCentered: true
  }
}

const defaultStyleOptions = {
  font: {
    name: 'Arial',
    color: { argb: 'FF000000' },
    family: 2,
    size: 10
  },
  alignment: { vertical: 'middle', horizontal: 'center' },
  border: {
    top: {style: 'thin'},
    left: {style: 'thin'},
    bottom: {style: 'thin'},
    right: {style: 'thin'}
  }
}

const getStyle = (customOptions) => {
  let dflt = JSON.parse(JSON.stringify(defaultStyleOptions))
  const style = Object.assign(dflt, customOptions)
  return style
}

const getHeaderStyle = (customOptions) => {
  const options = {
    font: {
      name: 'Arial',
      color: { argb: 'FFFFFFFF' },
      family: 2,
      bold: true,
      size: 11
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FF006004'}
    },
    border: {
      top: {style: 'double', color: {argb: 'FF00FF00'}},
      left: {style: 'double', color: {argb: 'FF00FF00'}},
      bottom: {style: 'double', color: {argb: 'FF00FF00'}},
      right: {style: 'double', color: {argb: 'FF00FF00'}}
    },
    height: 30
  }
  const style = Object.assign(options, customOptions)
  return style
}

const createWorkbook = (customOptions) => {
  const options = Object.assign(defaultWorkbookOptions, customOptions)
  const workbook = new Excel.Workbook()
  Object.keys(options).forEach(key => {
    workbook[key] = options[key]
  })

  return workbook
}

const createWorksheet = (workbook, name, customOptions) => {
  const options = Object.assign(defaultWorksheetOptions, customOptions)
  const worksheet = workbook.addWorksheet(name, options)
  worksheet.properties.outlineLevelCol = 1
  worksheet.properties.outlineLevelRow = 1

  return worksheet
}

const exportWorkbook = (workbook, fileName) => {
  const filePath = `${process.cwd()}/tmp/${fileName}-${new Date().getTime()}.xlsx`
  return workbook.xlsx.writeFile(filePath)
}

const exportWorkbookDownload = (workbook, res, fileName) => {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}-${new Date().getTime()}.xlsx`)
  return workbook.xlsx.write(res)
}

module.exports = {
  createWorkbook,
  createWorksheet,
  exportWorkbook,
  exportWorkbookDownload,
  getStyle,
  getHeaderStyle
}
