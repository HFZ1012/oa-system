const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const path = require('path')
const { mock } = require('mockjs')
const { baseURL } = require('../src/config')
const mockDir = path.join(process.cwd(), 'mock')
const { handleMockArray } = require('./utils')

/**
 *
 * @param app
 * @returns {{mockStartIndex: number, mockRoutesLength: number}}
 */
const registerRoutes = (app) => {
  let mockLastIndex
  const mocks = []
  const mockArray = handleMockArray()
  mockArray.forEach((item) => {
    const obj = require(item)
    mocks.push(...obj)
  })
  const mocksForServer = mocks.map((route) => {
    return responseFake(route.url, route.type, route.response)
  })
  for (const mock of mocksForServer) {
    app.use((req, res, next) => {
      // Mock Express properties
      if (!res.status) res.status = (code) => { res.statusCode = code; return res; };
      if (!res.json) res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
      if (!req.path) req.path = req.url.split('?')[0];

      if (mock.url.test(req.path)) {
        if (req.method.toLowerCase() === mock.type.toLowerCase() || mock.type === 'any') {
          mock.response(req, res)
        } else {
          next()
        }
      } else {
        next()
      }
    })
    mockLastIndex = app.stack ? app.stack.length : (app._router ? app._router.stack.length : 0)
  }
  const mockRoutesLength = Object.keys(mocksForServer).length
  return {
    mockRoutesLength: mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength,
  }
}

/**
 *
 * @param url
 * @param type
 * @param respond
 * @returns {{response(*=, *=): void, type: (*|string), url: RegExp}}
 */
const responseFake = (url, type, respond) => {
  // 处理baseURL和url，确保不会出现双斜杠
  const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
  const apiUrl = url.startsWith('/') ? url : `/${url}`
  return {
    url: new RegExp(`${base}${apiUrl}`),
    type: type || 'get',
    response(req, res) {
      res.status(200)
      if (JSON.stringify(req.body) !== '{}') {
        console.log(chalk.green(`> 请求地址：${req.path}`))
        console.log(chalk.green(`> 请求参数：${JSON.stringify(req.body)}\n`))
      } else {
        console.log(chalk.green(`> 请求地址：${req.path}\n`))
      }
      res.json(mock(respond instanceof Function ? respond(req, res) : respond))
    },
  }
}
/**
 *
 * @param app
 */
module.exports = (app) => {
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

  const mockRoutes = registerRoutes(app)
  let mockRoutesLength = mockRoutes.mockRoutesLength
  let mockStartIndex = mockRoutes.mockStartIndex
  chokidar
    .watch(mockDir, {
      ignored: /mock-server/,
      ignoreInitial: true,
    })
    .on('all', (event) => {
      if (event === 'change' || event === 'add') {
        try {
          if (app.stack) {
            app.stack.splice(mockStartIndex, mockRoutesLength)
          } else if (app._router && app._router.stack) {
            app._router.stack.splice(mockStartIndex, mockRoutesLength)
          }

          Object.keys(require.cache).forEach((item) => {
            if (item.includes(mockDir)) {
              delete require.cache[require.resolve(item)]
            }
          })
          const mockRoutes = registerRoutes(app)
          mockRoutesLength = mockRoutes.mockRoutesLength
          mockStartIndex = mockRoutes.mockStartIndex
        } catch (error) {
          console.log(chalk.red(error))
        }
      }
    })
}
