import { Client } from '@opensearch-project/opensearch';

// 환경 변수 검증
if (!process.env.OPENSEARCH_NODE_URL) {
    throw new Error('Environment variable OPENSEARCH_NODE_URL is missing');
}

const client = new Client({
    node: process.env.OPENSEARCH_NODE_URL || 'localhost:9200' || '192.168.219.100:9200', // 필수 옵션
    auth: {
        username: process.env.OPENSEARCH_USERNAME || 'admin', // 선택 사항
        password: process.env.OPENSEARCH_PASSWORD || 'IWantKillRed2689!', // 선택 사항
    },
});

export default client;
