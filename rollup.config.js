const path = require('path');
const nodeResolve = require('@rollup/plugin-node-resolve').default;
const uglify = require('rollup-plugin-uglify').uglify;
const merge = require('lodash.merge');
const pkg = require('./package.json');
const rollupTypescript = require('rollup-plugin-typescript2');

const extensions = ['.ts'];

const resolve = function (...args) {
  return path.resolve(__dirname, ...args);
};

// 打包任务的个性化配置
const jobs = {
  // build:umd - 编译出符合 umd 规范的可执行文件，供 jQuery、Vue、NodeJS 等项目使用
  umd: {
    output: {
      format: 'umd',
      file: resolve(pkg.main),
      name: 'lib',
    },
  },
  // build:min - 编译出符合 umd 规范的压缩的可执行文件
  min: {
    output: {
      format: 'umd',
      file: resolve(pkg.main.replace(/(.\w+)$/, '.min$1')),
      name: 'lib',
    },
    plugins: [uglify()],
  },
  esm: {
    output: {
      format: 'esm',
      file: resolve(pkg.module),
      name: 'lib',
    }
  },
};

// ts
const tsPlugin = rollupTypescript({
  tsconfig: resolve('./tsconfig.json'), // 导入本地ts配置
  extensions
})

// 从环境变量获取打包特征
const mergeConfig = jobs[process.env.FORMAT || 'esm'];

module.exports = merge(
  {
    input: resolve('./src/index.ts'),
    output: {},
    plugins: [
      nodeResolve({
        extensions,
        modulesOnly: true,
      }),
      tsPlugin,
    ],
  },
  mergeConfig,
);
