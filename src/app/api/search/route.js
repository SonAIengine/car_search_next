// app/api/search/route.js
import { NextResponse } from 'next/server';
import client from '@/utils/opensearchClient';
import buildProductSearchQuery from '@/utils/searchQueries';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json(
                    { error: 'Query parameter is required' },
                    { status: 400 }
            );
        }

        const searchQuery = await buildProductSearchQuery(query);
        console.log('Search Query:', JSON.stringify(searchQuery, null, 2));

        const response = await client.search(searchQuery);

        return NextResponse.json({
            items: response.body.hits.hits,
            total: response.body.hits.total.value
        });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
                { error: 'Internal server error', details: error.message },
                { status: 500 }
        );
    }
}