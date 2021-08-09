function movedCardEmail(
  cardCreator,
  userName,
  card,
  boardName,
  oldListName,
  newListName
) {
  return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Notification</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body bgcolor="#D1D8E0" style="margin: 0; padding: 0">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding: 10px 0 30px 0">
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  width="600"
                  style="border: 1px solid #cccccc; border-collapse: collapse"
                >
                  <tr>
                    <td
                      align="center"
                      bgcolor="#007BFF"
                      style="
                        padding: 20px 0 20px 0;
                        vertical-align: middle;
                        color: #fefefe;
                        font-size: 28px;
                        font-weight: bold;
                        font-family: Arial, sans-serif;
                      "
                    >
                      <img
                        src="https://i.ibb.co/mtq4xsL/logo.png"
                        alt="logo"
                        height="64"
                        border="0"
                        style="vertical-align: middle"
                      />
                      <span style=""> Manage Mo to </span>
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td
                            style="
                              color: #153643;
                              font-family: Arial, sans-serif;
                              font-size: 24px;
                            "
                          >
                            <b>Hello ${userName}, Here's what you missed....</b>
                          </td>
                        </tr>
      
                        <tr>
                          <td
                            style="
                              padding: 20px 0 10px 0;
                              color: #153643;
                              font-family: Arial, sans-serif;
                              font-size: 16px;
                              line-height: 20px;
                            "
                          >
                            <br />
                            <i>${cardCreator}</i> moved card
                            <b>"${card.name}"</b> from <b>${oldListName}</b> list to <b>${newListName}</b> list to the <b>${boardName}</b> board.
                            <br />
                            <br />
                          </td>
                        </tr>
                        <!-- <tr>
                                          <td>
                                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                 <img src="https://i.ibb.co/tC64Nwf/v1-1.png" alt="v1-1" border="0">
                                                 <img src="https://i.ibb.co/QkBBCBg/v1-2.png" alt="v1-2" border="0">
                                                 <img src="https://i.ibb.co/VQznsNq/v1-3.png" alt="v1-3" border="0">
                                                 <img src="https://i.ibb.co/2dGYMYQ/v1-4.png" alt="v1-4" border="0">
                                                 <img src="https://i.ibb.co/56WJPHm/v1-5.png" alt="v1-5" border="0">
                                              </table>
                                          </td>
                                      </tr> -->
                        <tr>
                          <td align="center">
                            <br />
                            <a
                              href="https://onecompileman.com/manage-mo-to/#/main/board/${card.boardId}?cardId=${card.id}"
                              style="
                              text-decoration:none;
                                width: 250px;
                                font-size: 16px;
                                font-family: Arial, Helvetica, sans-serif;
                                padding: 10px 20px;
                                background-color: #007bff;
                                color: #fefefe;
                                cursor: pointer;
                              "
                            >
                              Card Link
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#343a40" style="padding: 30px 30px 30px 30px">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td
                            style="
                              color: #ffffff;
                              font-family: Arial, sans-serif;
                              font-size: 14px;
                            "
                            width="75%"
                          >
                            Created by: Stephen Vinuya
                          </td>
                          <td align="right" width="25%">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td
                                  style="
                                    font-family: Arial, sans-serif;
                                    font-size: 12px;
                                    font-weight: bold;
                                  "
                                >
                                  <a
                                    href="https://www.linkedin.com/in/stephen-vinuya-54441b106/"
                                    style="color: #ffffff"
                                  >
                                    <img
                                      src="https://img.icons8.com/color/48/000000/linkedin.png"
                                      height="24"
                                    />
                                  </a>
                                </td>
                                <td
                                  style="
                                    font-family: Arial, sans-serif;
                                    font-size: 12px;
                                    font-weight: bold;
                                  "
                                >
                                  <a
                                    href="https://www.facebook.com/stephen.vinuya/"
                                    style="color: #ffffff"
                                  >
                                    <img
                                      src="https://img.icons8.com/fluent/48/000000/facebook-new.png"
                                      height="24"
                                    />
                                  </a>
                                </td>
                                <td
                                  style="
                                    font-family: Arial, sans-serif;
                                    font-size: 12px;
                                    font-weight: bold;
                                  "
                                >
                                  <a
                                    href="https://twitter.com/onecompileman"
                                    style="color: #ffffff"
                                  >
                                    <img
                                      src="https://img.icons8.com/fluent/48/000000/twitter.png"
                                      height="24"
                                    />
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>    
      `;
}

exports.movedCardEmail = movedCardEmail;
