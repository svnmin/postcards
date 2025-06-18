import { createApi } from 'unsplash-js';
import { NextResponse } from 'next/server';

const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY!,
    fetch: fetch as typeof fetch,
});

export async function GET() {
    try {
        const result = await unsplash.photos.getRandom({
            orientation: 'landscape',
            topicIds: ['hmenvQhUmxM'],
        });
        if (result.type === 'success') {

            const photo = Array.isArray(result.response) ? result.response[0] : result.response;
            //checking metadata
            console.log('Full photo:', JSON.stringify(photo, null, 2));

            return NextResponse.json({
                url: photo.urls.regular,
                user: {
                    name: photo.user.name,
                    username: photo.user.username,
                },
                link: photo.links.html,
            });
        } else {
            console.error('Unsplash error:', result.errors);
            return NextResponse.json({ error: result.errors }, { status: 500 });
        }
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Failed to fetch Unsplash image' }, { status: 500 });
    }
}