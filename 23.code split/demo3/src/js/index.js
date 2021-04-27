function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}

/*
  通过js代码，让某个文件被单独打包成一个chunk
  import动态导入语法：能将某个文件单独打包(test文件不会和index打包在同一个文件而是单独打包)
  webpackChunkName:指定test单独打包后文件的名字
  注意是/*
*/
import(/* webpackChunkName: "test" */ "./test")
  .then(({ mul }) => {
    /** 文件加载成功 */
    console.log(mul(2, 5));
  })
  .catch(() => {
    console.log("文件加载失败");
  });

// eslint-disable-next-line
console.log(sum(1, 2, 3, 4));
