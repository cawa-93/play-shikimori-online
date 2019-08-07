var fs = require('fs')
var deploy = require('firefox-extension-deploy')
const zipFolder = require('zip-folder')


const browser = process.env.BROWSER ? process.env.BROWSER : 'chrome'

// if (browser !== 'firefox') {
//   process.exit(1)
// }

let folder = `dist/${browser}`
let zipName = `${browser}.zip`


// credentials and IDs from gitlab-ci.yml file (your appropriate config file)
let ISSUER = process.env.FIREFOX_ISSUER
let SECRET = process.env.FIREFOX_SECRET
let EXTENSION_ID = process.env.FIREFOX_EXTENSION_ID


zipFolder(folder, zipName, function (err) {
	if (err) {
		console.log('oh no!', err)
		process.exit(1)
	} else {
		console.log(`Successfully Zipped ${folder} and saved as ${zipName}`)
		uploadZip() // on successful zipping, call upload
	}
})


function uploadZip() {
	const manifest = JSON.parse(fs.readFileSync(folder + '/manifest.json'))

	deploy({
		// obtained by following the instructions here:
		// https://addons-server.readthedocs.io/en/latest/topics/api/auth.html
		// or from this page:
		// https://addons.mozilla.org/en-US/developers/addon/api/key/
		issuer: ISSUER,
		secret: SECRET,

		// the ID of your extension
		id: EXTENSION_ID,

		version: manifest.version,

		// a ReadStream containing a .zip (WebExtensions) or .xpi (Add-on SDK)
		src: fs.createReadStream(zipName),
	}).then(function () {
		console.log('Successfully uploaded the ZIP')
	}, function (error) {
		console.log(`Error while uploading ZIP: ${error}`)
		process.exit(1)
	})

}

