// app/api/admin/games/[id]/route.js
import prisma from '../../../../../lib/prisma';

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const deletedGame = await prisma.pickGame.delete({
      where: { id: parseInt(id, 10) },
    });
    return new Response(JSON.stringify(deletedGame), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Game not found or error deleting game' }), { status: 404 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { teamRed, teamBlue } = await request.json();

  try {
    await prisma.pickGamePlayerChampion.deleteMany({
      where: { gameId: parseInt(id, 10) },
    });

    await Promise.all([
      ...teamRed.map(({ playerId, champion, lane }) =>
        prisma.pickGamePlayerChampion.create({
          data: {
            gameId: parseInt(id, 10),
            playerId,
            champion,
            lane, // Include lane
          },
        })
      ),
      ...teamBlue.map(({ playerId, champion, lane }) =>
        prisma.pickGamePlayerChampion.create({
          data: {
            gameId: parseInt(id, 10),
            playerId,
            champion,
            lane, // Include lane
          },
        })
      ),
    ]);

    return new Response(JSON.stringify({ message: 'Game updated successfully' }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to update game' }), { status: 500 });
  }
}