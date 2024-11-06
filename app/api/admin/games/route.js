// app/api/admin/games/route.js
import prisma from '../../../../lib/prisma';

export async function GET() {
    const games = await prisma.pickGame.findMany({
      include: {
        teamRed: {
          select: {
            id: true,
            name: true,
          },
        },
        teamBlue: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  
    return new Response(JSON.stringify(games), { status: 200 });
  }

  export async function POST(request) {
    const { teamRed, teamBlue, winningTeam } = await request.json();
  
    // Begin a transaction
    const newGame = await prisma.$transaction(async (tx) => {
      // Fetch player data for both teams to get LP values
      const teamRedPlayers = await tx.player.findMany({ where: { id: { in: teamRed } } });
      const teamBluePlayers = await tx.player.findMany({ where: { id: { in: teamBlue } } });
  
      // Calculate total LP for each team
      const totalLpRed = teamRedPlayers.reduce((sum, player) => sum + player.lpPick, 0);
      const totalLpBlue = teamBluePlayers.reduce((sum, player) => sum + player.lpPick, 0);
      const totalLp = totalLpRed + totalLpBlue;
  
      // Calculate LP percentage for each team
      const percentRed = totalLpRed / totalLp;
      const percentBlue = totalLpBlue / totalLp;
      const lpDifference = Math.abs(percentRed - percentBlue); // Difference in percentages
  
      // Base LP gain/loss
      const baseLpChange = 30;
      const lpAdjustment = lpDifference * baseLpChange;
      const extraLp = (Math.abs(totalLpRed - totalLpBlue))/1000
  
      // Determine LP adjustments for winning and losing teams
      let winningTeamAdjustment, losingTeamAdjustment;
      if (winningTeam === 'TEAM_RED') {
        // Team Red wins
        winningTeamAdjustment = percentRed > percentBlue ? baseLpChange - lpAdjustment - extraLp : baseLpChange + lpAdjustment + extraLp;
        losingTeamAdjustment = percentRed > percentBlue ? -(baseLpChange - lpAdjustment - extraLp) : -(baseLpChange + lpAdjustment + extraLp);
      } else {
        // Team Blue wins
        winningTeamAdjustment = percentBlue > percentRed ? baseLpChange - lpAdjustment - extraLp : baseLpChange + lpAdjustment + extraLp;
        losingTeamAdjustment = percentBlue > percentRed ? -(baseLpChange - lpAdjustment - extraLp) : -(baseLpChange + lpAdjustment + extraLp);
      }
  
      // Create the game entry
      const createdGame = await tx.pickGame.create({
        data: {
          date: new Date(),
          teamRed: { connect: teamRed.map((id) => ({ id })) },
          teamBlue: { connect: teamBlue.map((id) => ({ id })) },
          winningTeam,
        },
      });
  
      // Update games played for all players in both teams
      const allPlayers = [...teamRed, ...teamBlue];
      await tx.player.updateMany({
        where: { id: { in: allPlayers } },
        data: { gamesPlayedPick: { increment: 1 } },
      });
  
      // Update games won for players in the winning team
      const winningPlayers = winningTeam === 'TEAM_RED' ? teamRed : teamBlue;
      await tx.player.updateMany({
        where: { id: { in: winningPlayers } },
        data: { winsPick: { increment: 1 } },
      });
  
      // Apply LP adjustments
      const losingPlayers = winningTeam === 'TEAM_RED' ? teamBlue : teamRed;
      await Promise.all([
        ...winningPlayers.map((id) =>
          tx.player.update({
            where: { id },
            data: { lpPick: { increment: winningTeamAdjustment } },
          })
        ),
        ...losingPlayers.map((id) =>
          tx.player.update({
            where: { id },
            data: { lpPick: { increment: losingTeamAdjustment } },
          })
        ),
      ]);
  
      return createdGame;
    });
  
    return new Response(JSON.stringify(newGame), { status: 201 });
  }