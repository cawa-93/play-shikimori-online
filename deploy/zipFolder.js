// require modules
var fs = require('fs')
var archiver = require('archiver')


module.exports = function zipFolder(folder, zipName, options = {}) {
	return new Promise((resolve, reject) => {
		const output = fs.createWriteStream(zipName)
		const archive = archiver('zip')

		output.on('close', function () {
			resolve()
		})

		// good practice to catch this error explicitly
		archive.on('error', function (err) {
			reject(err)
		})

		// pipe archive data to the file
		archive.pipe(output)

		options = Object.assign({}, {
			ignore: '**/*.map',
			cwd: folder,
			dot: false,
			stat: false,
		}, options)

		// append files from a sub-directory, putting its contents at the root of archive
		archive.glob(`**`, options)

		// finalize the archive (ie we are done appending files but streams have to finish yet)
		// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
		archive.finalize()
	})
}