// app/api/admin/users/route.js
import prisma from '../../../../lib/prisma';

export async function GET() {
    const players = await prisma.player.findMany({
      select: {
        id: true,
        name: true,
        lpPick: true,
        gamesPlayedPick: true,
        winsPick: true,
        profilePic: true,
      },
    });
  
    return new Response(JSON.stringify(players), { status: 200 });
  }

export async function POST(request) {
  const { name, lpPick, profilePic } = await request.json();
  const newUser = await prisma.player.create({
    data: { name, lpPick, profilePic },
  });
  return new Response(JSON.stringify(newUser), { status: 201 });
}
