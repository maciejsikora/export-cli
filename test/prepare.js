const fs = require('fs')
const fsX = require('fs-extra')
// tests enviroment preparation

function createExampleDirectoryWithContent (directory) {
  fs.mkdirSync(directory)
  fs.writeFileSync(directory + '/example-file.js')
  fs.writeFileSync(directory + '/package.json')
  fs.mkdirSync(directory + '/example-package')
  fs.writeFileSync(directory + '/example-package/example-file.js')
  fs.writeFileSync(directory + '/example-package/package.json')
}

function initProjectStructure (directory) {
  fs.writeFileSync(directory + '/package.json')
  fs.writeFileSync(directory + '/.gitignore.json')
  fs.writeFileSync(directory + '/.gitkeep.json')
  createExampleDirectoryWithContent(directory + '/node_modules')
  createExampleDirectoryWithContent(directory + '/.git')

  createExampleDirectoryWithContent(directory + '/node_modules/additional-package')
}

function createTestDirectories (testDir) {
  fs.mkdirSync(testDir)
  fs.mkdirSync(testDir + '/project1')
  initProjectStructure(testDir + '/project1')
  fs.mkdirSync(testDir + '/project2')
  initProjectStructure(testDir + '/project2')
  fs.mkdirSync(testDir + '/not-a-project')
  fs.mkdirSync(testDir + '/projects-inside')
  fs.mkdirSync(testDir + '/projects-inside' + '/project3')
  initProjectStructure(testDir + '/projects-inside' + '/project3')
  fs.mkdirSync(testDir + '/projects-inside' + '/project4')
  initProjectStructure(testDir + '/projects-inside' + '/project4')
  fs.mkdirSync(testDir + '/projects-inside' + '/not-a-project')
}

function cleanTestDirectories (testDir) {
  fsX.removeSync(testDir)
}

module.exports = {
  createTestDirectories,
  cleanTestDirectories
}
