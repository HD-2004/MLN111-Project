import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import vm from "node:vm";

const [dataSource, appSource] = await Promise.all([
  readFile(new URL("../src/data.js", import.meta.url), "utf8"),
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
]);

const context = { window: {} };
vm.createContext(context);
vm.runInContext(dataSource, context);
const ai = context.window.APP_DATA.ai;

assert.equal(
  ai.eyebrow,
  "CHƯƠNG 3: BẢN CHẤT CỦA AI – ĐỈNH CAO VẬT CHẤT HAY KHỞI ĐẦU Ý THỨC?",
  "Expected Section 3 heading to match the newly provided exact content."
);

assert.equal(
  ai.lead,
  "Để giải quyết bài toán này một cách khách quan, Triết học Mác - Lênin không đứng ngoài dòng chảy công nghệ để phủ nhận hay thần thánh hóa máy móc. Chúng ta cần đặt AI vào đúng tọa độ biện chứng để phân tích: Bản thể của AI thuộc về đâu? và Hình thức phản ánh của AI có đồng nhất hay tiệm cận được với Ý thức con người không?",
  "Expected Section 3 lead to match the newly provided exact content."
);

assert.equal(
  ai.objective.heading,
  "Phân tích khách quan: Bản chất thực tại của AI là gì?",
  "Expected Section 3.1 heading to be present."
);

assert.equal(
  ai.objective.cards[0].text,
  "AI không tồn tại ở dạng tinh thần thuần túy. Bản thể của AI là các con chip Silicon, hệ thống bóng bán dẫn (transistors) điều khiển các xung điện nhị phân (0 và 1), kiến trúc máy tính tiên tiến, và mạng lưới trung tâm dữ liệu (Data Centers) tiêu thụ lượng điện năng khổng lồ. Đây hoàn toàn là một dạng thức vật chất cụ thể do con người cải tạo và tổ chức lại.",
  "Expected Card 01 body to match the newly provided exact content."
);

assert.equal(
  ai.contrast.heading,
  "Phân tích đối lập biện chứng: Khác biệt bản chất giữa Phản ánh của AI và Ý thức con người",
  "Expected Section 3.2 heading to be present."
);

assert.equal(
  ai.contrast.items[2].ai,
  "Đối với AI, nó sở hữu một cái \"vỏ vật chất\" cực kỳ tinh vi (các chuỗi văn bản, mã code, hình ảnh hiển thị trên màn hình) nhưng lại trống rỗng về phần \"ruột\" tư duy chủ quan. Khi AI gõ ra chữ \"Tự do\", nó hoàn toàn không có cảm thức hay khái niệm tâm lý về sự tự do; nó chỉ vận hành các token theo đúng cấu trúc ngữ pháp và xác suất đã học.",
  "Expected language-crisis AI paragraph to match the newly provided exact content."
);

assert.equal(
  ai.future.heading,
  "Góc nhìn khách quan, đa chiều: Khả năng tự tiến hóa của AI trong tương lai",
  "Expected Section 3.3 heading to be present."
);

assert.equal(
  Object.hasOwn(ai.future, "model"),
  false,
  "Expected the removed future model diagram to be absent from Section 3 data."
);

assert.doesNotMatch(
  appSource,
  /data\.ai\.future\.model|future-model/,
  "Expected the future model diagram block to be removed from the Section 3 layout."
);

assert.equal(
  ai.conclusion.heading,
  "KẾT LUẬN CHO CHƯƠNG 3",
  "Expected conclusion heading to match the newly provided exact content."
);

assert.equal(
  ai.conclusion.paragraphs[4],
  "Bản lĩnh của con người kỷ nguyên số không phải là sợ hãi bị AI thay thế, mà là dùng Ý thức năng động, đúng đắn của mình để định hướng, quản trị và làm chủ sự phát triển của Vật chất - AI phục vụ cho sự tiến bộ của nhân loại.",
  "Expected final conclusion paragraph to match the newly provided exact content."
);

assert.match(
  appSource,
  /data\.ai\.objective\.heading[\s\S]*data\.ai\.contrast\.heading[\s\S]*data\.ai\.future\.heading[\s\S]*data\.ai\.conclusion\.heading/,
  "Expected renderAI to render the new Section 3 structure."
);

console.log("ai-section-content: exact content checks passed");
