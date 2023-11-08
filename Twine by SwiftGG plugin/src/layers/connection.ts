import Tab = chrome.tabs.Tab;

export const enum Message {

}

export class Connection {
    private static instance: Connection

    private constructor() {
    }

    public static getInstance(): Connection {
        if (!Connection.instance) {
            Connection.instance = new Connection()
        }

        return Connection.instance
    }

    public on(message: Message, callback: (data: any, sender: chrome.runtime.MessageSender) => any) {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (!(request.type === message)) {
                sendResponse()
                return false
            }

            const result = callback(request.data, sender)

            if (result instanceof Promise) {
                result.then((value) => {
                    sendResponse(value)
                })

                return true
            } else {
                if (result) {
                    sendResponse(result)
                }
            }
        })
    }

    public async sendToTab(tab: Tab, message: Message, value: { [key: string]: any }): Promise<any> {
        if (tab.id) {
            const response = await chrome.tabs.sendMessage(tab.id, {
                type: message,
                ...value
            })

            return response.data
        }

        // Error
    }

    public async sendToBackground(message: Message, value: { [key: string]: any }): Promise<any> {
        return await chrome.runtime.sendMessage({
            type: message,
            ...value
        })
    }
}