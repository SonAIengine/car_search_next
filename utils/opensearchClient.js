import { Client } from "@opensearch-project/opensearch";

// 환경 변수 검증
if (!process.env.OPENSEARCH_NODE_URL) {
  throw new Error("Environment variable OPENSEARCH_NODE_URL is missing");
}

const client = new Client({
  node: process.env.OPENSEARCH_NODE_URL || "http://http://14.6.96.11:1006/", // 필수 옵션
  auth: {
    username: process.env.OPENSEARCH_USERNAME || "admin", // 선택 사항
    password: process.env.OPENSEARCH_PASSWORD || "Myopensearch!1", // 선택 사항
  },
});

export default client;
