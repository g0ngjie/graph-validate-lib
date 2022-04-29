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
