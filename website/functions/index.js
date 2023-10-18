const functions = require("firebase-functions");
const Mailjet = require('node-mailjet')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const mailjet = new Mailjet({
  apiKey: functions.config().mailjet.public_key,
  apiSecret: functions.config().mailjet.secret_key
})

exports.newsletter = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {

    if (!req.body.email) {
      res.status(500).send('Email not found.')
      return
    }

    try {
      await mailjet
        .post("contact", { 'version': 'v3' })
        .request({
          "IsExcludedFromCampaigns": false,
          "Email": req.body.email
        })
      await mailjet
        .post("contactslist", { 'version': 'v3' })
        .id("10366803")
        .action("managecontact")
        .request({
          "Action": "addnoforce",
          "Email": req.body.email
        })
      res.status(200).send('Success')
      return
    } catch (err) {
      res.status(403).send(err.message)
      return
    }
  })
})

exports.triggernewmatch = functions.firestore
  .document("matches/{documentId}")
  .onCreate(async (snap, context) => {
    const data = snap.data()
    console.log('Document with ID:', context.params.documentId, 'deleted.');
    console.log('Deleted document data:', data);

    const request = mailjet
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": "rugbywin.contact@gmail.com",
              "Name": "Rugby Win"
            },
            "Recipients": [
              {
                "ListID": 10366803
              }
            ],
            "TemplateID": 5189189,
            "TemplateLanguage": true,
            "Subject": `🔥 Nouveau Match: {{var:home_team:"France"}} vs {{var:away_team:"Italy"}} 🔥`,
            "Variables": {
              "home_team": data.teams.home_team,
              "away_team": data.teams.away_team
            }
          }
        ]
      })

    try {
      await request
    } catch (err) {
      console.log(err.message)
    }
  })
