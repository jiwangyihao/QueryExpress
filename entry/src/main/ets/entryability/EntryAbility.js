import UIAbility from '@ohos.app.ability.UIAbility';
import hilog from '@ohos.hilog';
import data_preferences from '@ohos.data.preferences';
import http from '@ohos.net.http';
let httpRequest = http.createHttp();
export default class EntryAbility extends UIAbility {
    onCreate(want, launchParam) {
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onCreate');
    }
    onDestroy() {
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onDestroy');
    }
    onWindowStageCreate(windowStage) {
        // Main window is created, set main page for this ability
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageCreate');
        let preferences = null;
        try {
            data_preferences.getPreferences(this.context, 'ExpressList', function (err, val) {
                if (err) {
                    console.error("Failed to get preferences. code =" + err.code + ", message =" + err.message);
                    return;
                }
                preferences = val;
                console.info("Succeeded in getting preferences.");
            });
            preferences.get('ExpressList', '[]').then((value) => {
                console.info("Succeeded in getting preferences value = " + value);
                let ExpressingList = [];
                let ExpressedList = [];
                JSON.parse(value).forEach(element => {
                    if (element.isExpressed) {
                        ExpressedList.push(element);
                    }
                    else {
                        httpRequest.request("https://qqlykm.cn/api/kd/?key=cCjvp4PwzIKpVwlv62wdaCJ86N&number=" + element, {
                            header: {
                                'Content-Type': 'application/json'
                            }
                        }).then((data) => {
                            console.info('Result:' + data.result);
                            const res = JSON.parse(data.result);
                            if (res.success) {
                                element.comName = res.data.comName;
                                element.logo = res.data.logo;
                                element.list = res.data.list;
                            }
                        }).catch((err) => {
                            console.info('error:' + JSON.stringify(err));
                        });
                        if (element.list[0].desc.match(/已签收/)) {
                            element.isExpressed = true;
                            ExpressedList.push(element);
                        }
                        else {
                            ExpressingList.push(element);
                        }
                    }
                });
                AppStorage.SetOrCreate('ExpressingList', ExpressingList);
                AppStorage.SetOrCreate('ExpressedList', ExpressedList);
            }).catch((err) => {
                console.error("Failed to get preferences. code =" + err.code + ", message =" + err.message);
            });
        }
        catch (err) {
            console.error("Failed to get preferences. code =" + err.code + ", message =" + err.message);
        }
        windowStage.loadContent('pages/Index', (err, data) => {
            var _a, _b;
            if (err.code) {
                hilog.error(0x0000, 'testTag', 'Failed to load the content. Cause: %{public}s', (_a = JSON.stringify(err)) !== null && _a !== void 0 ? _a : '');
                return;
            }
            hilog.info(0x0000, 'testTag', 'Succeeded in loading the content. Data: %{public}s', (_b = JSON.stringify(data)) !== null && _b !== void 0 ? _b : '');
        });
    }
    onWindowStageDestroy() {
        // Main window is destroyed, release UI related resources
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
        const ExpressingList = AppStorage.SetAndLink('ExpressingList', []).get();
        const ExpressedList = AppStorage.SetAndLink('ExpressedList', []).get();
        const ExpressList = ExpressingList.concat(ExpressedList);
        let preferences = null;
        try {
            data_preferences.getPreferences(this.context, 'ExpressList', function (err, val) {
                if (err) {
                    console.error("Failed to get preferences. code =" + err.code + ", message =" + err.message);
                    return;
                }
                preferences = val;
                console.info("Succeeded in getting preferences.");
            });
            preferences.put('ExpressList', JSON.stringify(ExpressList))
                .catch((err) => {
                console.error("Failed to get preferences. code =" + err.code + ", message =" + err.message);
            });
        }
        catch (err) {
            console.error("Failed to get preferences. code =" + err.code + ", message =" + err.message);
        }
    }
    onForeground() {
        // Ability has brought to foreground
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onForeground');
    }
    onBackground() {
        // Ability has back to background
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onBackground');
    }
}
//# sourceMappingURL=EntryAbility.js.map