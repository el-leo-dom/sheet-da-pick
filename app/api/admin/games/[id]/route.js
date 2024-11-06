// app/api/admin/games/[id]/route.js
import prisma from '../../../../../lib/prisma';

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const deletedGame = await prisma.pickGame.delete({
      where: { id: parseInt(id, 10) },
    });
    return new Response(JSON.stringify(deletedGame), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Game not found or error deleting game' }), { status: 404 });
  }
}
