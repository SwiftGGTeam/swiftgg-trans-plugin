import { Config } from "../layers/config";
import { Browser } from "../layers/tBrowser";

(async () => {
    await Browser.getInstance().setup()
})()