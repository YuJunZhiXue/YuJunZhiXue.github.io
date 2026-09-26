/**
 * 生成首页组件数据（posts-data.json）
 * 输出：title / url / date / tags / categories / cover
 * 供 首页最近更新滚动条、标签云、分类卡片墙 使用
 * 比 search.json 更完整（search.json 缺 date/categories/cover）
 */
hexo.extend.generator.register("postsData", function (locals) {
  var posts = locals.posts
    .sort("-date")
    .map(function (post) {
      return {
        title: post.title || "",
        url: "/" + post.path,
        date: post.date ? post.date.format("YYYY-MM-DD") : "",
        tags: (post.tags || []).map(function (t) {
          return t.name;
        }),
        categories: (post.categories || []).map(function (c) {
          return c.name;
        }),
        cover: post.cover || post.thumbnail || "",
      };
    });

  return {
    path: "posts-data.json",
    data: JSON.stringify(posts),
  };
});
