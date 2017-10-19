# export-cli
Cli tool for JavaScript projects export.

![travis-cli](https://travis-ci.org/maciejsikora/export-cli.svg?branch=master)

## about
**Export-cli** is a command line tool written in node.js. The tool helps in backup and export of any single or many JavaScript projects in efficient and fast way.

**Export-cli** is traversing through directory structure in order to find every js project, in the final result it exports found projects into a flat structure, optionaly archives them. It's not exporting node_modules and .git directories, thanks that the export procedure is quick and doesn't contain not wanted resources, and such resources have in most cases numerous of times more files than the project itself.

## when I need it
Let's imagine nested directory structure:

- projects
    - project1
    - project2
    - private
      - project3
      - project4
    - work
      - project5
      - project6
    - github
      - account1
        - project7
      - account2
        - project8
        

Every project in above structure has many files, **node_modules** with humongous files count. If you want to backup, move all projects,  it can be tricky. The worst thing is the fact that probably 80% of files there, are dependency files(node_modules) and git files (.git). Moving them by standard copy for example to an usb disk will be time consuming, probably also needed disk space can be huge. Offcourse you can go there and try to remove not needed resources, but this is tipical time wasting job. 

And here comes **export-cli**, by one simple command `export projects`, the script will find every project in presented structure and export it into a flat structure, additionaly it can create an archive. The most important is also the fact that it will exclude all not needed files, so export will stay flat and potentially thin.

## install
npm install -g export-cli

## usage - command line
`export <command> [srcDirectory] <targetDirectory>`
  - command, (optional, default - export)possible options: 
    - export - default command - exports to directory
    - archive - creates archive
  - srcDirectory (mandatory): relative path of directory to export from
  - targetDirectory (optional): target path of saving export
  

## example usage

#### Export all projects from ./exampleNpmProject to ./exampleNpmProject-(timestamp):
`export exampleNpmProject`

#### Export all projects from ./exampleNpmProject to ./targetDirectory:
`export exampleNpmProject targetDirectory`

#### Archive all projects from ./exampleNpmProject to ./targetArchive.zip:
`export archive exampleNpmProject targetArchive`

#### Archive all projects from ./exampleNpmProject to ./exampleNpmProject-(timestamp).zip:
`export archive exampleNpmProject`
