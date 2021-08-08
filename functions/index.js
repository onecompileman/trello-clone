const functions = require('firebase-functions');
const admin = require('firebase-admin');

const nodemailer = require('nodemailer');
const { welcomeEmail } = require('./src/email-templates/welcome');
const { sendEmailService } = require('./src/send-email');
const { movedCardEmail } = require('./src/email-templates/moved-card');
const { createdCardEmail } = require('./src/email-templates/created-card');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'managemoto29@gmail.com',
    pass: 'neuclbfduxmudhvr',
  },
});

admin.initializeApp();

exports.onAddedUserToBoard = functions.firestore
  .document('boards/{boardId}')
  .onUpdate(async (snap, context) => {
    const boardNow = snap.after.data();
    boardNow.id = snap.after.id;
    const boardBefore = snap.before.data();

    if (boardNow.users.length != boardBefore.users.length) {
      const invitor = (
        await admin.firestore().collection('users').doc(boardNow.userId).get()
      ).data();

      const newlyAddedUsersIds = boardNow.users.filter(
        (user) => !boardBefore.users.includes(user)
      );

      newlyAddedUsersIds.forEach(async (userId) => {
        const addedUser = (
          await admin.firestore().collection('users').doc(userId).get()
        ).data();

        const html = welcomeEmail(
          invitor.displayName,
          addedUser.name,
          boardNow
        );

        await sendEmailService(
          transporter,
          addedUser.email,
          'Manage Mo To: You are invited',
          html
        );
      });
    }
  });

exports.onCardUpdated = functions.firestore
  .document('cards/{cardId}')
  .onUpdate(async (snap, context) => {
    const cardNow = snap.after.data();
    cardNow.id = snap.after.id;
    const cardBefore = snap.before.data();

    if (cardNow.listId !== cardBefore.listId) {
      const board = (
        await admin.firestore().collection('boards').doc(cardNow.boardId).get()
      ).data();

      const oldList = (
        await admin.firestore().collection('lists').doc(cardBefore.listId).get()
      ).data();

      const newList = (
        await admin.firestore().collection('lists').doc(cardNow.listId).get()
      ).data();

      board.users.filter(user !== cardNow.userId).forEach(async (userId) => {
        const user = (
          await admin.firestore().collection('users').doc(userId).get()
        ).data();

        const html = movedCardEmail(
          invitor.displayName,
          user.name,
          cardNow,
          board.name,
          oldList.name,
          newList.name
        );

        await sendEmailService(
          transporter,
          user.email,
          'Manage Mo To: Card moved',
          html
        );
      });
    }
  });

exports.onCardAdded = functions.firestore
  .document('cards/{cardId}')
  .onCreate(async (snap, context) => {
    const cardNow = snap.after.data();
    cardNow.id = snap.after.id;

    const board = (
      await admin.firestore().collection('boards').doc(cardNow.boardId)
    ).data();

    board.users.filter(user !== cardNow.userId).forEach(async (userId) => {
      const user = (
        await admin.firestore().collection('users').doc(userId)
      ).data();

      const html = createdCardEmail(
        invitor.displayName,
        user.name,
        cardNow,
        board.name
      );

      await sendEmailService(
        transporter,
        user.email,
        'Manage Mo To: Card Created',
        html
      );
    });
  });
