import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import vm from "node:vm";

const [dataSource, appSource, styleSource] = await Promise.all([
  readFile(new URL("../src/data.js", import.meta.url), "utf8"),
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
]);

const context = { window: {} };
vm.createContext(context);
vm.runInContext(dataSource, context);
const manifesto = context.window.APP_DATA.manifesto;

assert.equal(
  manifesto.chapterHeading,
  "CHƯƠNG 5: THE MANIFESTO – BẢN LĨNH Ý THỨC VÀ KHÁI QUÁT CHUNG",
  "Expected the full Chapter 5 heading from the prompt to be preserved."
);
assert.equal(
  manifesto.interfaceNote,
  "(Giao diện: Khối hộp kết luận lớn, chữ phát sáng, mang tính tổng kết và kêu gọi hành động)",
  "Expected the interface note from the prompt to be visible content."
);
assert.equal(manifesto.synthesisHeading, "Khái quát luận điểm học thuật (Synthesis)");
assert.equal(
  manifesto.synthesisIntro,
  "Trải qua hành trình bóc tách từ lịch sử tư tưởng đến thực tại công nghệ, Triết học Mác - Lênin cho phép chúng ta đưa ra một kết luận toàn diện và khách quan:"
);

assert.equal(
  JSON.stringify(manifesto.synthesis.map((item) => item.title)),
  JSON.stringify([
    "AI là đỉnh cao của sự vận động vật chất",
    "AI là sản phẩm kết tinh từ ý thức con người",
    "Sự phản ánh của AI không thể thay thế bản chất người",
  ]),
  "Expected the three manifesto synthesis cards to use the exact required titles."
);

assert.equal(
  manifesto.synthesis[0].text,
  "Mọi mô hình ngôn ngữ lớn, mạng neural nhân tạo suy cho cùng đều là các dạng biểu hiện cụ thể của vật chất được tổ chức ở trình độ cao. Nó chịu sự quyết định tuyệt đối của giới hạn phần cứng, năng lượng và dữ liệu."
);
assert.equal(
  manifesto.synthesis[1].text,
  "Sự tồn tại của AI không hề phủ nhận chủ nghĩa duy vật, ngược lại, nó là minh chứng hùng hồn cho tính độc lập tương đối và sức mạnh tác động trở lại của ý thức. Ý thức của con người (chủ thể) đã nhận thức đúng quy luật vật lý, toán học để nhào nặn thế giới khách quan, tạo ra AI nhằm mục đích nối dài năng lực tư duy của chính mình."
);
assert.equal(
  manifesto.synthesis[2].text,
  "Máy móc xử lý ký hiệu nhưng không thấu hiểu ý nghĩa; máy móc học dữ liệu nhưng không tham gia lao động sản xuất thực tế và không có các quan hệ xã hội. Vì vậy, AI vẫn nằm ở ranh giới của sự mô phỏng cơ học, chưa thể chạm tới bản chất lịch sử - xã hội của ý thức con người."
);

assert.equal(manifesto.manifestoHeading, "Thông điệp hành động kỷ nguyên số (Manifesto)");
assert.equal(JSON.stringify(manifesto.manifestoText), JSON.stringify([
  "Hiểu đúng bản chất của Triết học Mác - Lênin giải phóng chúng ta khỏi hai cái bẫy tư duy nguy hiểm: Chủ nghĩa duy tâm thần bí (sợ hãi, thần thánh hóa máy móc vô căn cứ) và Chủ nghĩa duy vật tầm thường (coi con người sinh học cũng chỉ là một cỗ máy chạy thuật toán).",
  "Bản lĩnh của con người trong kỷ nguyên số là bản lĩnh của một chủ thể có ý thức. Máy móc có thể sở hữu tốc độ xử lý hàng tỷ phép tính mỗi giây, nhưng con người sở hữu trái tim biết rung động, ý chí hướng tới các giá trị nhân văn và năng lực cải tạo xã hội thông qua hoạt động thực tiễn.",
]));
assert.equal(
  manifesto.finalStatement,
  "\"AI không thay thế con người. Chỉ có những con người biết làm chủ AI sẽ thay thế những con người tụt hậu. Hãy dùng ý thức đúng đắn để làm chủ thế giới vật chất số hóa, định hình một tương lai công nghệ nhân văn và tiến bộ!\""
);

assert.match(appSource, /manifesto-section/);
assert.match(appSource, /data\.manifesto\.chapterHeading/);
assert.match(appSource, /data\.manifesto\.interfaceNote/);
assert.match(appSource, /renderManifestoHeading\(data\.manifesto\.chapterHeading\)/);
assert.match(appSource, /manifesto-title-kicker/);
assert.match(appSource, /manifesto-title-main/);
assert.match(appSource, /manifesto-title-subline/);
assert.match(appSource, /manifesto-synthesis-grid/);
assert.match(appSource, /manifesto-box/);
assert.match(appSource, /manifesto-quote/);
assert.doesNotMatch(appSource, /data\.manifesto\.eyebrow/);
assert.doesNotMatch(appSource, /data\.manifesto\.title/);
assert.doesNotMatch(appSource, /artifact-grid reveal/);
assert.match(styleSource, /#manifesto\.manifesto-section/);
assert.match(styleSource, /\.manifesto-title-kicker/);
assert.match(styleSource, /\.manifesto-title-main/);
assert.match(styleSource, /\.manifesto-title-subline/);
assert.match(styleSource, /\.manifesto-synthesis-grid/);
assert.match(styleSource, /\.manifesto-quote/);

console.log("manifesto-section: exact content and layout checks passed");
