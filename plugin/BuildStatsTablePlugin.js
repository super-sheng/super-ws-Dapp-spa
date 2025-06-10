class BuildStatsTablePlugin {
  apply(compiler) {
    compiler.hooks.done.tap({
      name: 'BuildStatsTablePlugin',
      stage: 1000  // 很大的数字，确保最后执行
    }, (stats) => {
      this.displayBuildTable(stats)
    })
  }
  
  displayBuildTable(stats) {
    const Table = require('cli-table3')
    const {filesize} = require('filesize')
    const path = require('path')
    
    const assets = stats.toJson().assets
    
    // 创建表格
    const table = new Table({
      head: ['文件名', '大小', 'Gzip 大小', '类型'],
      colWidths: [40, 15, 15, 10],
      style: {
        head: ['cyan', 'bold'],
        border: ['grey']
      }
    })
    
    // 计算总大小
    let totalSize = 0
    
    // 按大小排序
    assets
      .filter(asset => !asset.name.includes('.map')) // 过滤 source map
      .sort((a, b) => b.size - a.size)
      .forEach(asset => {
        const ext = path.extname(asset.name)
        const type = this.getFileType(ext)
        const gzipSize = asset.info?.minimized ? 
          filesize(Math.round(asset.size * 0.3)) : // 估算 gzip 大小
          'N/A'
        
        table.push([
          asset.name,
          filesize(asset.size),
          gzipSize,
          type
        ])
        
        totalSize += asset.size
      })
    
    // 显示构建信息
    console.log('\n🎉 构建完成！\n')
    console.log('📦 构建产物详情:')
    console.log(table.toString())
    console.log(`\n📊 总大小: ${filesize(totalSize)}`)
    console.log(`⏱️  构建时间: ${stats.endTime - stats.startTime}ms`)
    console.log(`📁 输出目录: ${stats.compilation.outputOptions.path}\n`)
  }
  
  getFileType(ext) {
    const typeMap = {
      '.js': 'JS',
      '.css': 'CSS',
      '.html': 'HTML',
      '.png': 'IMG',
      '.jpg': 'IMG',
      '.jpeg': 'IMG',
      '.gif': 'IMG',
      '.svg': 'SVG',
      '.woff': 'FONT',
      '.woff2': 'FONT',
      '.ttf': 'FONT',
    }
    return typeMap[ext] || 'OTHER'
  }
}

module.exports = BuildStatsTablePlugin