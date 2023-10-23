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

exports.ai = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {

    if (!req.body.team_a || !req.body.team_b) {
      res.status(500).send('Need tow teams...')
      return
    }

    try {
      const response = await fetch("https://api.obviously.ai/v3/model/automl/predict/single/ffc23890-6117-11ee-a611-4715fb958c39", {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'ApiKey 7d49ef56-6110-11ee-a67f-aed432a5522d'
        },
        body: JSON.stringify({
          "home_team": req.body.team_a,
          "away_team": req.body.team_b,
          "neutral": "False",
          "world_cup": "True"
        })
      })

      const data = await response.json()
      console.log('Data :', data);

      res.status(200).send(data)
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
