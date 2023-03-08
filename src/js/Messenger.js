import parceDate from './parceDate';

export default class Messenger {
  constructor() {
    this.username = null;
    this.webSocket = new WebSocket('ws://localhost:8000/ws');
    this.addListenersToPage = this.addListenersToPage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.messenger = document.querySelector('.messenger-wrapper');
    this.userID = null;
    this.userNames = [];
  }

  init() {
    this.addListenersToPage();
  }

  addListenersToPage() {
    this.webSocket.addEventListener('message', (evt) => {
      const message = JSON.parse(evt.data);
      this.getMessageFromServer(message);
    });

    const autorizationForm = document.querySelector('.authorization-form');
    autorizationForm.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.name = evt.target[0].value;
      evt.target.classList.add('invisible');
      const messenger = document.querySelector('.messenger-wrapper');
      messenger.classList.remove('invisible');
      this.userNames.forEach((username) => {
        if (username === this.name) {
          // eslint-disable-next-line no-alert
          alert('Error name!');
          evt.target.classList.remove('invisible');
          evt.currentTarget.reset();
          messenger.classList.add('invisible');
        }
      });
      this.sendMessage('connect');
    });

    const messageForm = document.querySelector('.messenger__new-message-form');
    messageForm.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const content = messageForm[0].value;
      this.sendMessage('message', content);
      messageForm[0].value = '';
    });
  }

  sendMessage(type, content) {
    if (this.webSocket.readyState === WebSocket.OPEN) {
      const message = {
        type,
        name: this.name,
        userID: this.userID,
      };
      if (content === '') {
        return;
      }
      const date = parceDate(Date.now());
      message.date = date;
      message.content = content;
      this.webSocket.send(JSON.stringify(message));
    }
  }

  getMessageFromServer(message) {
    const { type } = message;

    if (type === 'connect' || type === 'disconnect') {
      this.refreshUserList(message.allUsers);
      this.userNames = message.allUsers;
    }
    if (type === 'message') {
      this.postMessage(message);
    }
    if (type === 'reportID') {
      this.userID = message.userID;
    }
    if (type === 'error') {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }

  refreshUserList(users) {
    const oldUserList = this.messenger.querySelector('.messenger-users');
    const newUserList = document.createElement('div');
    newUserList.classList.add('messenger-users');
    users.forEach((element) => {
      const user = document.createElement('div');
      user.classList.add('messenger-users__user');
      const userImage = document.createElement('div');
      userImage.classList.add('messenger-users__user-image');
      const userName = document.createElement('div');
      if (element === this.name) {
        userName.textContent = 'You';
        userName.classList.add('messenger-users__you-user-name');
      } else {
        userName.textContent = element;
        userName.classList.add('messenger-users__user-name');
      }
      user.appendChild(userImage);
      user.appendChild(userName);
      newUserList.appendChild(user);
    });

    this.messenger.replaceChild(newUserList, oldUserList);
  }

  postMessage(message) {
    const messageArea = this.messenger.querySelector('.messenger__messages');
    const newMessage = document.createElement('div');
    newMessage.classList.add('messenger__message');
    const author = document.createElement('div');
    if (message.userID === this.userID) {
      newMessage.classList.add('messenger__your-message');
      author.classList.add('messenger__your-message-author');
      author.textContent = `${'You'} ${message.date}`;
    } else {
      newMessage.classList.add('messenger__other-message');
      author.classList.add('messenger__message-author');
      author.textContent = `${message.name} ${message.date}`;
    }

    const chat = document.createElement('div');
    chat.classList.add('messenger__message-content');

    chat.innerHTML = message.content.replace(/\n/g, '<br/>');

    newMessage.appendChild(author);
    newMessage.appendChild(chat);

    messageArea.appendChild(newMessage);
  }
}
