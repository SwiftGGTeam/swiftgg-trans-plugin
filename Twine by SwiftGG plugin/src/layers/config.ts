import {Storage, StorageFlag} from "./storage";
import {Browser} from "./tBrowser";

export class Config {
    private static instance: Config

    private constructor() {
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config()
        }

        return Config.instance
    }

    public get autoTranslate(): Promise<boolean> {
        return (async (): Promise<boolean> => {
            const shouldAutoTranslate = await Storage.getInstance().getBoolean(StorageFlag.autoTranslate) ?? false

            if (!shouldAutoTranslate) {
                await Browser.getInstance().setIcon("closed")
            }

            return shouldAutoTranslate
        })()
    }

    public set autoTranslate(value: boolean) {
        (async () => {
            await Storage.getInstance().setValue(StorageFlag.autoTranslate, value)
        })()
    }
}