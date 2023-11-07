import DNR = chrome.declarativeNetRequest;

export const enum BrowserType {
    chrome,
    safari,
    firefox,
    unknown
}

export class Browser {
    private static instance: Browser

    private constructor() {
    }
    public static getInstance(): Browser {
        if (!Browser.instance) {
            Browser.instance = new Browser()
        }

        return Browser.instance
    }

    public async setup(): Promise<void> {
        if (await this.detectBrowser() === BrowserType.firefox) { await this.disableCSP() }
    }

    public async setIcon(type: "closed" | "running" | "translating" | "translating-paused"): Promise<void> {
        await chrome.action.setIcon({ path: { "128": `/source/intro/swiftLogo-${type}.png`} })
    }

    public async detectBrowser(): Promise<BrowserType> {
        const isChrome = typeof chrome !== 'undefined'
        const isFirefox = typeof browser !== 'undefined' && (await browser.runtime.getBrowserInfo()).name === "Firefox"
        const isSafari = typeof safari !== 'undefined'

        if (isSafari) {
            return BrowserType.safari
        } else if (isFirefox) {
            return BrowserType.firefox
        } else if (isChrome) {
            return BrowserType.chrome
        } else {
            return BrowserType.unknown
        }
    }

    private async disableCSP(): Promise<void> {
        let addRules: DNR.Rule[] = [],
            removeRuleIds: number[] = []

        const id = 724

        addRules.push({
            id,
            priority: 9999999999,
            action: {
                type: DNR.RuleActionType.MODIFY_HEADERS,
                responseHeaders: [
                    {
                        header: 'Content-Security-Policy',
                        operation: DNR.HeaderOperation.SET,
                        value: 'default-src * \'unsafe-inline\' \'unsafe-eval\' data: blob:; '
                    }
                ]
            },
            condition: {
                urlFilter: "||developer.apple.com*",
                resourceTypes: [DNR.ResourceType.MAIN_FRAME, DNR.ResourceType.SUB_FRAME]
            }
        })

        chrome.browsingData.remove({}, { serviceWorkers: true }, () => {})

        await chrome.declarativeNetRequest.updateSessionRules({addRules, removeRuleIds})
    }
}