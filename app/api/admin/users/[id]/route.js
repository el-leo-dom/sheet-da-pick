// app/api/admin/users/[id]/route.js
import prisma from '../../../../../lib/prisma';

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const deletedUser = await prisma.player.delete({
      where: { id: parseInt(id, 10) },
    });
    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'User not found or error deleting user' }), { status: 404 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const updatedData = await request.json();

  try {
    const updatedUser = await prisma.player.update({
      where: { id: parseInt(id, 10) },
      data: updatedData,
    });
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'User not found or error updating user' }), { status: 404 });
  }
}
