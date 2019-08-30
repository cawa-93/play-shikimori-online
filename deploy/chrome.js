const zipFolder = require('./zipFolder.js')
const fs = require('fs')

const browser = 'chrome'

let folder = `dist/${browser}`
let zipName = `${browser}.zip`


zipFolder(folder, zipName)
    .then(() => {
        console.log(`Successfully Zipped ${folder} and saved as ${zipName}`)
        uploadZip() // on successful zipping, call upload
    })
    .catch(err => {
        console.log('Can not create zip:', err)
        process.exit(1)
    })


function uploadZip() {
    // credentials and IDs from gitlab-ci.yml file (your appropriate config file)
    let REFRESH_TOKEN = process.env.WEBSTORE_REFRESH_TOKEN
    let EXTENSION_ID = process.env.WEBSTORE_EXTENSION_ID
    let CLIENT_SECRET = process.env.WEBSTORE_CLIENT_SECRET
    let CLIENT_ID = process.env.WEBSTORE_CLIENT_ID

    const webStore = require('chrome-webstore-upload')({
        extensionId: EXTENSION_ID,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
    })


    // creating file stream to upload
    const extensionSource = fs.createReadStream(`./${zipName}`)

    // upload the zip to webstore
    webStore.uploadExisting(extensionSource).then(res => {
        console.log('Successfully uploaded the ZIP')

        // publish the uploaded zip
        webStore.publish().then(res => {
            console.log('Successfully published the newer version')
        }).catch((error) => {
            console.log(`Error while publishing uploaded extension: ${error}`)
            process.exit(1)
        })

    }).catch((error) => {
        console.log(`Error while uploading ZIP: ${error}`)
        process.exit(1)
    })
}
