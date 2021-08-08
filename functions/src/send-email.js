function sendEmailService(transporter, to, subject, html) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: 'Manage Mo To No Reply <managemoto29@gmail.com>',
      to,
      subject,
      html,
    };

    // returning result
    transporter.sendMail(mailOptions, (erro, info) => {
      if (erro) {
        return reject(erro.toString());
      }
      return resolve('Sended');
    });
  });
}

exports.sendEmailService = sendEmailService;
