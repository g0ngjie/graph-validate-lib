# graph-validate-lib

图形验证库

## randomBlock

> 随机字符验证

```js
new randomBlock(
  {
    container: document.getElementById("block"),
    line: true,
    point: true,
    fill: true,
    fontSize: 50,
    charNum: 5,
    factor: "1234567890",
  },
  function (randomStr) {
    console.log(randomStr);
  }
);
```

| 参数      | 说明                       | 默认值                                                         |
| --------- | -------------------------- | -------------------------------------------------------------- |
| container | DOM 节点                   | -                                                              |
| line      | 干扰线                     | false                                                          |
| point     | 噪点                       | false                                                          |
| fill      | 字体填充                   | false                                                          |
| fontSize  | 字体大小                   | 50                                                             |
| charNum   | 随机字符数量               | 4                                                              |
| factor    | 随机因子                   | ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 |
| callback  | 回调函数，返回当前随机字符 | -                                                              |

## Slider

> 滑块验证

```js
new lib.slider(
  { container, title: "sliding unlock", success: "unlock" },
  (res) => {
    console.log("[debug]res:", res);
  }
);
```

| 参数      | 说明         | 默认值   |
| --------- | ------------ | -------- |
| container | DOM 节点     | -        |
| title     | 默认展示文案 | 滑动解锁 |
| success   | 成功文案     | 解锁成功 |

## TextClick

> 文字点选验证

```js
new lib.TextClick(
  {
    container: document.getElementById("app"),
    width: 400,
    height: 200,
    images: [
      "https://th.bing.com/th/id/OIP.2gS4UgpMqzgMv_WcelDaZwAAAA?pid=ImgDet&rs=1",
      "https://th.bing.com/th/id/OIP.W3ZzYPC0KT8ijxyc-1wpGAAAAA?pid=ImgDet&rs=1",
      "https://th.bing.com/th/id/R.0233d6fa7a283ac2cc9adbbce09b2150?rik=mAI8iultzrL3OQ&pid=ImgRaw&r=0&sres=1&sresct=1",
    ],
    fontStr: "冒菜火锅麻辣烫全部都好吃",
  },
  function (res) {
    console.log("[debug]res:", res);
  }
);
```

| 参数      | 说明          | 默认值     |
| --------- | ------------- | ---------- |
| container | DOM 节点      | -          |
| width     | 宽度          | 320        |
| height    | 高度          | 160        |
| fontStr   | 字符串预选池  | 1234567890 |
| fontNum   | 字符数量      | 5          |
| checkNum  | 校验数量      | 3          |
| accuracy  | 精度          | 15         |
| images    | 图片 URL 列表 | []         |

## RandomCalc

> 随机字符串验证

```js
new lib.RandomCalc(
  {
    container: document.getElementById("app"),
    width: 320,
    height: 60,
  },
  function (res) {
    console.log("[debug]res:", res);
  }
);
```

| 参数      | 说明       | 默认值     |
| --------- | ---------- | ---------- |
| container | DOM 节点   | -          |
| width     | 宽度       | 320        |
| height    | 高度       | 60         |
| range     | 数值区间   | 100        |
| operator  | 运算符列表 | ["+", "-"] |
