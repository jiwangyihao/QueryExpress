import UIAbility from '@ohos.app.ability.UIAbility';
import hilog from '@ohos.hilog';
import window from '@ohos.window';
import data_preferences from '@ohos.data.preferences';
import http from '@ohos.net.http';

let httpRequest = http.createHttp();

interface ExpressState {
  time: number
  desc: string
}

interface ListExpress {
  number: string
  comName: string
  logo: string
  isExpressed: boolean
  list: ExpressState[]
}

export default class EntryAbility extends UIAbility {
  onCreate(want, launchParam) {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onCreate');
  }

  onDestroy() {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
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
      })
      preferences.get('ExpressList', '[]').then((value) => {
        console.info("Succeeded in getting preferences value = " + value);
        let ExpressingList = [];
        let ExpressedList = [];
        (<ListExpress[]> JSON.parse(value)).forEach(element => {
          if (element.isExpressed) {
            ExpressedList.push(element);
          } else {
            httpRequest.request("https://qqlykm.cn/api/kd/?key=cCjvp4PwzIKpVwlv62wdaCJ86N&number=" + element, {
              header: {
                'Content-Type': 'application/json'
              }
            }).then((data) => {
              console.info('Result:' + data.result);
              const res = JSON.parse(<string> data.result);
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
            } else {
              ExpressingList.push(element);
            }
          }
        })

        AppStorage.SetOrCreate('ExpressingList', ExpressingList);
        AppStorage.SetOrCreate('ExpressedList', ExpressedList);
      }).catch((err) => {
        console.error("Failed to get preferences. code =" + err.code + ", message =" + err.message);
      })
    } catch (err) {
      console.error("Failed to get preferences. code =" + err.code + ", message =" + err.message);
    }

    windowStage.loadContent('pages/Index', (err, data) => {
      if (err.code) {
        hilog.error(0x0000, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
        return;
      }
      hilog.info(0x0000, 'testTag', 'Succeeded in loading the content. Data: %{public}s', JSON.stringify(data) ?? '');
    });
  }

  onWindowStageDestroy() {
    // Main window is destroyed, release UI related resources
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');

    const ExpressingList: ListExpress[] = AppStorage.SetAndLink('ExpressingList', []).get()
    const ExpressedList: ListExpress[] = AppStorage.SetAndLink('ExpressedList', []).get()

    const ExpressList: ListExpress[] = ExpressingList.concat(ExpressedList);

    let preferences = null;
    try {
      data_preferences.getPreferences(this.context, 'ExpressList', function (err, val) {
        if (err) {
          console.error("Failed to get preferences. code =" + err.code + ", message =" + err.message);
          return;
        }
        preferences = val;
        console.info("Succeeded in getting preferences.");
      })
      preferences.put('ExpressList', JSON.stringify(ExpressList))
        .catch((err) => {
          console.error("Failed to get preferences. code =" + err.code + ", message =" + err.message);
        })
    } catch (err) {
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
