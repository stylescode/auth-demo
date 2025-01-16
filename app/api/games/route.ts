import { NextResponse } from 'next/server';
import { fetchGames } from '@/utils/rawg';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    const games = await fetchGames(query);

    return NextResponse.json(games);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
