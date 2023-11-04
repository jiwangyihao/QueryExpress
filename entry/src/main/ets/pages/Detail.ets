import router from '@ohos.router'

interface ExpressState {
  time: string
  content: string
}

interface ListExpress {
  number: string
  comName: string
  updateTime: string
  isExpressed: boolean
  list: ExpressState[]
}

@Entry
@Component
struct Detail {
  @State message: string = 'Hello World'
  @State Express: ListExpress = AppStorage.SetAndLink('Express', {
    "number": "",
    "comName": "",
    "updateTime": "",
    "isExpressed": false,
    "list": [
      { "time": "", "content": "" }
    ]
  }).get()

  build() {
    Row() {
      Column() {
        Text("<  快递详情")
          .fontSize(18)
          .width('100%')
          .margin({ top: 10, bottom: 20, left: 20 })
          .textAlign(TextAlign.Start)
          .fontColor('#017CFE')
          .onClick(() => {
            router.back()
          })

        Row() {
          Image($r("app.media.express"))
            .margin({ top: 10, bottom: 10, right: 10 })
            .height(54)
          Column() {
            Text(this.Express.comName)
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
            Text(this.Express.number)
              .fontSize(12)
            Text(this.Express.list[0].content)
              .fontSize(12)
              .maxLines(2)
            Text(this.Express.updateTime)
              .fontSize(12)
          }
          .flexShrink(1)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Start)
        }
        .borderRadius(10)
        .padding(10)
        .backgroundColor('#fff')
        .width('100%')
        .margin({ bottom: 10 })

        Text("- 送件历史 -")
          .fontSize(16)
          .margin({ bottom: 10 })

        Scroll() {
          List({ space: 10, initialIndex: 0 }) {
            ForEach(this.Express.list, (item, index) => {
              ListItem() {
                Row() {
                  Column() {
                    Text(item.time)
                      .fontSize(16)
                      .fontWeight(FontWeight.Bold)
                    Text(item.content)
                      .fontSize(12)
                  }
                  .flexShrink(1)
                  .justifyContent(FlexAlign.Center)
                  .alignItems(HorizontalAlign.Start)
                }
                .width('100%')
                .borderRadius(10)
                .padding(10)
                .backgroundColor('#fff')
              }
              .width('100%')
            }, item => item)
          }
        }
        .flexShrink(1)
      }
      .height('100%')
      .padding(10)
    }
    .height('100%')
    .backgroundColor('#eee')
  }
}