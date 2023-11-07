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


}