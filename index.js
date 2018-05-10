require("dotenv").config();

var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var axios = require("axios");
var slack = require("@slack/client");
var qs = require("querystring");

//Here we are configuring express to use body-parser as middle-ware.
var web = new slack.WebClient();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/slack", function(req, res) {
  if (req.body.command === "/start") {
    var start = {
      text: "select the user to challenge for world domination",
      attachments: [
        {
          fallback: "Pre-filled because you have actions in your attachment.",
          color: "#d2dde1",
          mrkdwn_in: ["text", "pretext", "fields"],
          callback_id: "123",
          attachment_type: "default",
          actions: [
            {
              name: "select users bitch",
              text: "select users bitch",
              type: "select",
              value: "select users bitch",
              data_source: "users"
            }
          ]
        }
      ]
    };
    res.send(start);
  }
  res.send(req.body.challenge);
});

app.post("/actions", function(req, res) {
  var token =
    "xoxa-168473113569-335267578817-335821063970-8a566fdfba2d09364d73baf6efd13a66";
  //console.log(req.body.payload.actions);
  //var user = req.body.payload.actions.selected_options.value;
  var object = JSON.parse(req.body.payload);

  if (object.callback_id === "123") {
    var user = object.actions[0].selected_options[0].value;
    var userr = object.user.id;

    var attachments = JSON.stringify([
      {
        fallback: "Pre-filled because you have actions in your attachment.",
        color: "#d2dde1",
        mrkdwn_in: ["text", "pretext", "fields"],
        callback_id: "1234",
        attachment_type: "default",
        actions: [
          {
            name: "Yes",
            text: "Yes",
            type: "button",
            style: "default",
            value: "Yes"
          },
          {
            name: "No",
            text: "No",
            type: "button",
            style: "default",
            value: "No"
          }
        ]
      }
    ]);

    var send = qs.stringify({
      token: token,
      channel: object.channel.id,
      text:
        "<@" +
        userr +
        "> has challenged you <@" +
        user +
        "> at a game of tic tac toe for world domination bruh bruh you accept or nah?!",
      attachments: attachments
    });
  }

  if (object.callback_id === "1234") {
    console.log(object);
    if (object.actions[0].value === "Yes") {
      var send = qs.stringify({
        token: token,
        channel: object.channel.id,
        text: "game is started"
      });
      startGame();
    } else {
      var send = qs.stringify({
        token: token,
        channel: object.channel.id,
        text: "game is not started"
      });
    }
  }
  axios.post("https://slack.com/api/chat.postMessage", send);

  function startGame() {
    var attachments = JSON.stringify([
      {
        fallback: "Pre-filled because you have actions in your attachment.",
        color: "#d2dde1",
        mrkdwn_in: ["text", "pretext", "fields"],
        callback_id: "Pre-filled because you have actions in your attachment.",
        attachment_type: "default",
        actions: [
          {
            name: "Button text",
            text: "-",
            type: "button",
            style: "default",
            value: "Button text"
          },
          {
            name: "Button text",
            text: "-",
            type: "button",
            style: "default",
            value: "Button text"
          },
          {
            name: "Button text",
            text: "-",
            type: "button",
            style: "default",
            value: "Button text"
          }
        ]
      },
      {
        fallback: "Pre-filled because you have actions in your attachment.",
        color: "#d2dde1",
        mrkdwn_in: ["text", "pretext", "fields"],
        callback_id: "Pre-filled because you have actions in your attachment.",
        attachment_type: "default",
        actions: [
          {
            name: "Button text",
            text: "-",
            type: "button",
            style: "default",
            value: "Button text"
          },
          {
            name: "Button text",
            text: "-",
            type: "button",
            style: "default",
            value: "Button text"
          },
          {
            name: "Button text",
            text: "-",
            type: "button",
            style: "default",
            value: "Button text"
          }
        ]
      },
      {
        fallback: "Pre-filled because you have actions in your attachment.",
        color: "#d2dde1",
        mrkdwn_in: ["text", "pretext", "fields"],
        callback_id: "Pre-filled because you have actions in your attachment.",
        attachment_type: "default",
        actions: [
          {
            name: "Button text",
            text: "-",
            type: "button",
            style: "default",
            value: "Button text"
          },
          {
            name: "Button text",
            text: "-",
            type: "button",
            style: "default",
            value: "Button text"
          },
          {
            name: "Button text",
            text: "-",
            type: "button",
            style: "default",
            value: "Button text"
          }
        ]
      }
    ]);

    var msg = qs.stringify({
      token: token,
      channel: object.channel.id,
      text: "Game status",
      attachments: attachments
    });

    axios.post("https://slack.com/api/chat.postMessage", msg);
  }
  res.status(200).send("");
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});
