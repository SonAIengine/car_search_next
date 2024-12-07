import { Client } from '@opensearch-project/opensearch';

const client = new Client({
    node: process.env.OPENSEARCH_NODE_URL || 'http://localhost:9200', // 기본 URL
    auth: {
        username: process.env.OPENSEARCH_USERNAME || 'admin', // 기본 사용자
        password: process.env.OPENSEARCH_PASSWORD || 'IWantKillRed2689!', // 기본 비밀번호
    },
});

export default client;
