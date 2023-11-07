import {Storage, StorageFlag} from "./storage";

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

    private _autoTranslate: boolean | undefined

    public get autoTranslate(): Promise<boolean> {
        return (async (): Promise<boolean> => {
            if (this._autoTranslate) {
                return this._autoTranslate
            }

            const shouldAutoTranslate = await Storage.getInstance().getBoolean(StorageFlag.autoTranslate)
                ?? false

            this._autoTranslate = shouldAutoTranslate

            return shouldAutoTranslate
        })()
    }

    public set autoTranslate(value: boolean) {
        (async () => {
            this._autoTranslate = value
            await Storage.getInstance().setValue(StorageFlag.autoTranslate, value)
        })()
    }
}