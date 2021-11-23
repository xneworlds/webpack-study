/** 引入jq资源 */
import $ from "jquery";
/** 引入样式资源 */
import "./index.less";

$("#title").on("click", () => {
  $("body").css("backgrandColor", "deeppink");
});
