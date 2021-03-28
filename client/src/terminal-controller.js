import ComponentBlessed from "./components.js";
import { constants } from "./contants.js";

export default class TerminalController {
  #usersCollors = new Map()

  constructor() {}

  #pickCollor() {
    return '#' + `${((1 << 24) * Math.random() | 0).toString(16)}` + '-fg'
  }

  #getUserCollor(userName) {
    if(this.#usersCollors.has(userName)) return this.#usersCollors.get(userName);
    const collor = this.#pickCollor()

    this.#usersCollors.set(userName, collor);

    return collor
  }

  #onInputReceived(eventEmitter) {
    return function () {
      const message = this.getValue()
      this.clearValue()
    }
  }

  #onMessageReceived({ screen, chat }) {
    return ({ userName, message }) => {
      const collor = this.#getUserCollor(userName)

      chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)
      screen.render()
    }
  }

  #onChangedLog({ screen, activityLog}) {
    return (msg) => {
      const [userName] = msg.split(/\s/)
      const collor = this.#getUserCollor(userName)
      activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)

      screen.render()
    }
  }

  #onStatusUpdated({ screen, statusLog}) {
    return (users) => {
      const {content} = statusLog.items.shift()
      statusLog.clearItems()
      statusLog.addItem(content)

      users.forEach(userName => {
        const collor = this.#getUserCollor(userName)
        statusLog.addItem(`{${collor}}{bold}${userName}{/}`)
      })

      screen.render()
    }
  }

  #registerEvents(eventEmitter, components) {
    eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
    eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onChangedLog(components))
    eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusUpdated(components))
  }

  async initializeTable(eventEmitter) {
    const components = new ComponentBlessed()
      .setScreen({ title: 'HackerChat - David Ferreira' })
      .setLayoutComponent()
      .setChatComponent()
      .setStatusLog()
      .setActivityLogs()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .build()

      components.input.focus()
      components.input.render()

      this.#registerEvents(eventEmitter, components)
  }
}
