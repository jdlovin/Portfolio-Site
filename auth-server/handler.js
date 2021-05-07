'use strict';

const AWS = require('aws-sdk');
const SES = new AWS.SES();

function sendEmail(formData, callback) {
  const emailParams = {
    Source: formData.ses_address,
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: [formData.send_to],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.reply_to}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'formData.subject',
      },
    },
  };
  SES.sendEmail(emailParams, callback);
}

module.exports.siteMail = (event, context, callback) => {
  const formData = JSON.parse(event.body);

  sendEmail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'applications/json',
        'Access-Control-Origin': 'https://www.lovinthelife.com',
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };
    callback(null, response);
  });
};
