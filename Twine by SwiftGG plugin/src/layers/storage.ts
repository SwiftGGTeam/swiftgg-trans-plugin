export const enum StorageFlag {
    autoTranslate = "AUTO_TRANSLATE"
}

export class Storage {
    private static instance: Storage

    private constructor() {
    }

    public static getInstance(): Storage {
        if (!Storage.instance) {
            Storage.instance = new Storage()
        }

        return Storage.instance
    }

    public async setValue(flag: StorageFlag, value: any): Promise<void> {
        await chrome.storage.local.set({ flag: value })
    }

    public async getBoolean(flag: StorageFlag): Promise<boolean | undefined> {
        const result = await chrome.storage.local.get(flag)
        if (typeof result[flag] === "boolean") {
            return result[flag]
        }

        return undefined
    }
}