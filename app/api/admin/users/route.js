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
      championSelections: {
        select: {
          champion: true,
          game: {
            select: {
              id: true,
              winningTeam: true,
              teamRed: { select: { id: true } }, // Fetch team members
              teamBlue: { select: { id: true } }
            },
          },
        },
      },
    },
  });

  // Process the data to add win/loss status for each champion selection
  const processedPlayers = players.map(player => {
    const championSelections = player.championSelections.map(selection => {
      const isTeamRed = selection.game.teamRed.some(teamPlayer => teamPlayer.id === player.id);
      const playerTeamWon = (isTeamRed && selection.game.winningTeam === 'TEAM_RED') ||
                            (!isTeamRed && selection.game.winningTeam === 'TEAM_BLUE');
      
      return {
        champion: selection.champion,
        gameId: selection.game.id,
        win: playerTeamWon,
      };
    });
    return {
      ...player,
      championSelections,
    };
  });

  return new Response(JSON.stringify(processedPlayers), { status: 200 });
}

export async function POST(request) {
  const { name, lpPick, profilePic } = await request.json();
  const newUser = await prisma.player.create({
    data: { name, lpPick, profilePic },
  });
  return new Response(JSON.stringify(newUser), { status: 201 });
}
