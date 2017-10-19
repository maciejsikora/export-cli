const assert = require('assert')
const klawSync = require('klaw-sync')
const fs = require('fs')
const rewire = require('rewire')
const path = require('path')

const { createTestDirectories, cleanTestDirectories } = require('./prepare')
const { exportProjects, archiveProjects } = require('../exporter')

const pa = rewire('../exporter.js')

// private module functions
const isDirProject = pa.__get__('isDirProject')
const findProjects = pa.__get__('findProjects')
const getDirectoryNameFromPath = pa.__get__('getDirectoryNameFromPath')
const cleanTarget = pa.__get__('cleanTarget')
const copyToTarget = pa.__get__('copyToTarget')
const ignoredDirs = pa.__get__('ignoredDirs')

const TEST_DIR = path.join(__dirname, 'test-dir')
const TEMP_DIR = path.join(__dirname, 'tmp')

createTestDirectories(TEST_DIR)

after(() => cleanTestDirectories(TEST_DIR))

describe('Identify if directory is a project', () => {
  it('"test-dir" - is not a project', () => {
    assert.strictEqual(false, isDirProject(TEST_DIR))
  })

  it('"test-dir/project1" - is a project', () => {
    assert.strictEqual(true, isDirProject(TEST_DIR + '/project1'))
  })

  it('"test-dir/project2" - is a project', () => {
    assert.strictEqual(true, isDirProject(TEST_DIR + '/project2'))
  })

  it('"test-dir/not-a-project" - is not a project', () => {
    assert.strictEqual(false, isDirProject(TEST_DIR + '/not-a-project'))
  })
})

describe('Find projects', () => {
  it('"test-dir" - should have 4 projects', () => {
    assert.strictEqual(4, findProjects(TEST_DIR).length)
  })

  it('"test-dir/projects-inside" - should have 2 projects', () => {
    assert.strictEqual(2, findProjects(TEST_DIR + '/projects-inside').length)
  })

  it('"test-dir/not-a-project" - should have no projects', () => {
    assert.strictEqual(0, findProjects(TEST_DIR + '/not-a-project').length)
  })
})

describe('Get dirname from the path', () => {
  it('"test-dir"', () => {
    assert.strictEqual('test-dir', getDirectoryNameFromPath(TEST_DIR))
  })

  it('"not-a-project"', () => {
    assert.strictEqual('not-a-project', getDirectoryNameFromPath(TEST_DIR + '/not-a-project'))
  })

  it('"project3"', () => {
    assert.strictEqual('project3', getDirectoryNameFromPath(TEST_DIR + '/projects-inside/project3'))
  })

  // windows
  it('"project2"', () => {
    assert.strictEqual('project2', getDirectoryNameFromPath('C:\\Users\\something\\Desktop\\projects\\privates\\flowers\\test\\test-dir\\project2'))
  })
})

describe('Copy to destination', () => {
  it('Should have 4 projects in tmp', () => {
    cleanTarget(TEMP_DIR)
    copyToTarget(TEST_DIR, TEMP_DIR)
    assert.strictEqual(4, findProjects(TEMP_DIR).length)
    cleanTarget(TEMP_DIR)
  })

  it('Should have 2 projects in tmp', () => {
    cleanTarget(TEMP_DIR)
    copyToTarget(path.join(TEST_DIR, '/projects-inside'), TEMP_DIR)
    assert.strictEqual(2, findProjects(TEMP_DIR).length)
    cleanTarget(TEMP_DIR)
  })

  it('Projects should not have node_modules or .git inside', () => {
    cleanTarget(TEMP_DIR)
    copyToTarget(path.join(TEST_DIR, 'projects-inside'), TEMP_DIR)

    const filter = item => item.path.indexOf(ignoredDirs.node_modules) > 0 || item.path.indexOf(ignoredDirs.git) > 0
    const unwantedDirs = klawSync(TEMP_DIR, { nofile: true, filter, noRecurseOnFailedFilter: false })

    assert.strictEqual(0, unwantedDirs.length)
    cleanTarget(TEMP_DIR)
  })

  it('Project should have left .gitignore and .gitkeep files', () => {
    cleanTarget(TEMP_DIR)
    copyToTarget(path.join(TEST_DIR, 'project1'), TEMP_DIR)

    const filter = item => item.path.indexOf('.gitignore') > 0 || item.path.indexOf('.gitkeep') > 0
    const wantedFiles = klawSync(TEMP_DIR, { filter, noRecurseOnFailedFilter: true })

    assert.strictEqual(2, wantedFiles.length)
    cleanTarget(TEMP_DIR)
  })

  it('Copy one project only', () => {
    cleanTarget(TEMP_DIR)
    copyToTarget(path.join(TEST_DIR, 'project1'), TEMP_DIR)
    assert.strictEqual(true, fs.existsSync(TEMP_DIR + '/package.json'))
    cleanTarget(TEMP_DIR)
  })

  it('Copy wrong directory name', () => {
    assert.throws(
      () => {
        copyToTarget(path.join(TEST_DIR, 'not-exists'), TEMP_DIR)
      },
      Error
    )
  })
})

describe('Export function tests', () => {
  it('Should export projects to temp directory', () => {
    cleanTarget(TEMP_DIR)
    exportProjects(TEST_DIR, TEMP_DIR)
    assert.strictEqual(true, fs.existsSync(TEMP_DIR))
    cleanTarget(TEMP_DIR)
  })

  it('Should create zip', () => {
    const zipPath = TEMP_DIR + '.zip'
    cleanTarget(zipPath)
    archiveProjects(TEST_DIR, TEMP_DIR)
    assert.strictEqual(true, fs.existsSync(zipPath))
    cleanTarget(zipPath)
  })
})
