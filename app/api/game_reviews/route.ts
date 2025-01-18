import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { PrismaClient } from '@prisma/client';
import { fetchGame } from '@/utils/rawg';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const gameId = url.searchParams.get('gameId');

  if (!gameId) {
    return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { game_id: parseInt(gameId) },
    include: { user: true },
  });

  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { gameId, reviewText, userId } = await request.json();
    console.log(gameId, reviewText, userId);
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId},
    });

    if (!user) {
      console.log('could NOT find a user');
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    // Check if the game exists in the database
    let game = await prisma.game.findUnique({
      where: { id: parseInt(gameId) },
    });

    if (!game) {
      // Optionally fetch from RAWG and add to database
      const fetchedGame = await fetchGame(gameId);
      if (fetchedGame) {
        game = await prisma.game.create({
          data: {
            id: parseInt(gameId),
            name: fetchedGame.name,
            release: new Date(fetchedGame.released),
          },
        });
      } else {
        return NextResponse.json(
          { error: "Game not found" },
          { status: 404 }
        );
      }
    }
    // Create the review
    const review = await prisma.review.create({
      data: {
        game_id: game.id,
        user_id: user.id,
        review_text: reviewText,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, reviewText } = await request.json();

    const review = await prisma.review.update({
      where: { id },
      data: { review_text: reviewText },
    });

    return NextResponse.json(review);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { role, publicUserId } = session.user;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review || (review.user_id !== publicUserId && role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Review deleted' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}