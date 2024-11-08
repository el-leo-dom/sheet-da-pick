'use client'

import { useState, useEffect } from "react";
import './MainPage.css'
import { displayRank } from './displayRank.js'
import { champions } from "./icons/champs/champsArray";

export default function Home() {
  // const [sidebarChoice, setSidebarChoice] = useState('sheetdapick') // sheetdapick, leaderboard
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([])
  const [expandedPlayerId, setExpandedPlayerId] = useState(null);

  useEffect(() => {
    fetchPlayers();
    fetchGames();
  }, []);

  async function fetchPlayers() {
    const response = await fetch('/api/admin/users');
    const data = await response.json();
    // Sort players by LP in descending order before setting state
    const sortedPlayers = data.sort((a, b) => b.lpPick - a.lpPick);
    setPlayers(sortedPlayers);
  }

  async function fetchGames() {
    const response = await fetch('/api/admin/games');
    const data = await response.json();
    // Sort games by date (assuming 'date' is available as a timestamp or Date object)
    const sortedGames = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setGames(sortedGames);
  }

  function getChampionIcon(championName) {
    const champion = champions.find((champ) => champ.name === championName);
    return champion ? `/champs/${champion.name}.png` : null; // Adjust path if necessary
  }


  function toggleExpandPlayer(playerId) {
    setExpandedPlayerId(prev => (prev === playerId ? null : playerId)); // Toggle expansion
  }

  function getPlayerChampionStats(player) {
    const stats = {};
    let totalWins = 0, totalLosses = 0;
    if (player.championSelections) {
      player.championSelections.forEach(selection => {
        const { champion, win } = selection;
        if (!stats[champion]) {
          stats[champion] = { games: 0, wins: 0, losses: 0 };
        }
        stats[champion].games += 1;
        if (win) {
          stats[champion].wins += 1;
          totalWins += 1;
        } else {
          stats[champion].losses += 1;
          totalLosses += 1;
        }
      });
    }
    return {
      championStats: stats,
      totalWins,
      totalLosses,
      totalGames: totalWins + totalLosses,
      winRate: ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1),
    };
  }

  function getPlayerRoleStats(player) {
    const roleStats = {};
    if (player.championSelections) {
      player.championSelections.forEach(selection => {
        const { lane, win } = selection;
        if (!roleStats[lane]) {
          roleStats[lane] = { games: 0, wins: 0, losses: 0 };
        }
        roleStats[lane].games += 1;
        if (win) {
          roleStats[lane].wins += 1;
        } else {
          roleStats[lane].losses += 1;
        }
      });
    }
  
    // Calculate win rates for each role
    Object.keys(roleStats).forEach(role => {
      const { wins, games } = roleStats[role];
      roleStats[role].winRate = ((wins / games) * 100).toFixed(1);
    });
  
    return roleStats;
  }

  function getRoleIcon(lane) {
    const roleIcons = {
      TOP: '/rank_and_positions/Position_Gold-Top.png',
      JUNGLE: '/rank_and_positions/Position_Gold-Jungle.png',
      MID: '/rank_and_positions/Position_Gold-Mid.png',
      BOT: '/rank_and_positions/Position_Gold-Bot.png',
      SUPPORT: '/rank_and_positions/Position_Gold-Support.png',
      NONE: '/icons/none.png', // Default icon for "None"
    };
  
    return roleIcons[lane] || roleIcons.NONE; // Fallback to NONE if no match
  }

  function getRankIcon(lp) {
    if (2000 <= lp  && lp <= 2399) return '/rank_and_positions/emblem-diamond.png';
    if (1600 <= lp  && lp <= 1999) return '/rank_and_positions/emblem-platinum.png';
    if (1200 <= lp  && lp <= 1599) return '/rank_and_positions/emblem-gold.png';
    if (800 <= lp  && lp <= 1199) return '/rank_and_positions/emblem-silver.png';
    if (400 <= lp  && lp <= 799) return '/rank_and_positions/emblem-bronze.png';
    if (0 <= lp  && lp <= 399) return '/rank_and_positions/emblem-iron.png';
  }

  return (
      <div className="mainpage-overlay">
        {/* 
        <div className="mainpage-sidebar-container">
          <div className="mainpage-sidebar">
            <div onClick={() => setSidebarChoice('leaderboard')} className="mainpage-sidebar-option">
              Leaderboard
            </div>
            <div onClick={() => setSidebarChoice('sheetdapick')} className="mainpage-sidebar-option">
              Sheet da Pick
            </div>
          </div>
        </div>
        */}
        <div className="mainpage-content-container">
            <div className="mainpage-content-sheet">
              <div className="mainpage-content-sheet-top3-container">
                <div className="mainpage-content-sheet-top3-title">
                  Top 3 Monstros da Pick
                </div>
                <div className="mainpage-content-sheet-top3-podium">
                  <div className="mainpage-content-sheet-top3-podium3">
                    3
                  </div>
                  <div className="mainpage-content-sheet-top3-podium1">
                    2
                  </div>
                  <div className="mainpage-content-sheet-top3-podium2">
                    1
                  </div>
                </div>
              </div>
              <div className="mainpage-content-info-container">
                <div className="mainpage-content-latestgames-list">
                  <div className="mainpage-content-latestgames-list-title">
                    Lista de Jogos
                  </div>
                  <div className="mainpage-content-latestgames-list-gamelist">
                    {games.map((game) => (
                      <div key={game.id} className="mainpage-content-latestgames-list-gameitem">
                        <div className="mainpage-content-latestgames-list-gameitem-top">
                          <div className="mainpage-content-latestgames-list-gameitem-top-winner">
                            Vencedores: {game.winningTeam === "TEAM_RED" ? "Red Team" : "Blue Team"}
                          </div>
                          <div className="mainpage-content-latestgames-list-gameitem-top-date">
                            {new Date(game.date).toLocaleDateString()} {new Date(game.date).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="mainpage-content-latestgames-list-gameitem-bot">
                          <div 
                          className="mainpage-content-latestgames-list-gameitem-team"
                          style={{backgroundColor: '#fab1b1'}}>
                              {game.teamRed.map((player) => (
                                <div key={player.id} className="mainpage-content-latestgames-list-gameitem-team-player">
                                  {player.championSelections
                                    .filter((selection) => selection.gameId === game.id) // Filter for the specific game champion selection
                                    .map((selection) => (
                                      <img
                                        key={selection.champion}
                                        src={getChampionIcon(selection.champion)}
                                        alt={selection.champion}
                                        className="mainpage-content-latestgames-list-gameitem-team-player-icon"
                                      />
                                    ))}
                                  {player.name}
                                  <div className="mainpage-content-latestgames-list-gameitem-team-player-role">
                                    <img
                                      src={getRoleIcon(player.championSelections[0]?.lane || "NONE")}
                                      alt={player.championSelections[0]?.lane || "None"}
                                      className="mainpage-content-latestgames-list-gameitem-team-player-role-icon"
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                          <div className="mainpage-content-latestgames-list-gameitem-lpchange">
                            <span>{Math.round(game.lpChangeTeamRed)}</span>
                            <span>{Math.round(game.lpChangeTeamBlue)}</span>
                          </div>
                          <div 
                          className="mainpage-content-latestgames-list-gameitem-team"
                          style={{backgroundColor: '#b1b2fa'}}>
                              {game.teamBlue.map((player) => (
                                <div key={player.id} className="mainpage-content-latestgames-list-gameitem-team-player">
                                  {player.championSelections
                                    .filter((selection) => selection.gameId === game.id) // Filter for the specific game champion selection
                                    .map((selection) => (
                                      <img
                                        key={selection.champion}
                                        src={getChampionIcon(selection.champion)}
                                        alt={selection.champion}
                                        className="mainpage-content-latestgames-list-gameitem-team-player-icon"
                                      />
                                    ))}
                                  {player.name}
                                  <div className="mainpage-content-latestgames-list-gameitem-team-player-role">
                                    <img
                                      src={getRoleIcon(player.championSelections[0]?.lane || "NONE")}
                                      alt={player.championSelections[0]?.lane || "None"}
                                      className="mainpage-content-latestgames-list-gameitem-team-player-role-icon"
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mainpage-content-sheet-list">
                  <div className="mainpage-content-sheet-list-topbar">
                    <div className="mainpage-content-sheet-list-topbar-player">
                      Jogador
                    </div>
                    <div className="mainpage-content-sheet-list-topbar-wins">
                      Wins
                    </div>
                    <div className="mainpage-content-sheet-list-topbar-games">
                      Jogos
                    </div>
                    <div className="mainpage-content-sheet-list-topbar-rank">
                      Rank
                    </div>
                    <div className="mainpage-content-sheet-list-topbar-lp">
                      LP
                    </div>
                  </div>
                  {players.map((player) => (
                    <>
                    <div onClick={() => toggleExpandPlayer(player.id)} key={player.id} className="mainpage-content-sheet-list-item">
                        <div className="mainpage-content-sheet-list-player">
                          {player.name}
                          <img
                            src={getRankIcon(player.lpPick)}
                            alt="Rank Emblem"
                            className="mainpage-content-sheet-list-player-rank-icon"
                          />
                        </div>
                        <div className="mainpage-content-sheet-list-wins">
                          {player.winsPick}
                        </div>
                        <div className="mainpage-content-sheet-list-games">
                          {player.gamesPlayedPick}
                        </div>
                        <div className="mainpage-content-sheet-list-rank">
                          {displayRank(player.lpPick)}
                        </div>
                        <div className="mainpage-content-sheet-list-lp">
                          {player.lpPick % 100}
                        </div>
                    </div>
                    {expandedPlayerId === player.id && (
                      <div className="player-expanded-stats-modal">
                        <div onClick={() => toggleExpandPlayer(null)}
                        className="player-expanded-stats-modal-close">
                          &times;
                        </div>
                        <div
                        className="player-expanded-stats-modal-title">
                          Stats detalhadas: &nbsp; <span style={{fontSize: '1.5rem'}}>{player.name}</span>
                        </div>
                        <div className="player-expanded-stats-modal-body">
                          <div className="player-expanded-stats-modal-body-left">
                            <div className="player-expanded-stats-modal-body-total-stats">
                              <div><strong>Wins:</strong> &nbsp; {getPlayerChampionStats(player).totalWins}</div>
                              <div><strong>Losses:</strong> &nbsp; {getPlayerChampionStats(player).totalLosses}</div>
                              <div><strong>Total Games:</strong> &nbsp; {getPlayerChampionStats(player).totalGames}</div>
                              <div><strong>Rank:</strong> &nbsp; {displayRank(player.lpPick)} - {player.lpPick % 100} LP</div>
                              <div><strong>Total LP:</strong> &nbsp; {player.lpPick}</div>
                              <div><strong>Win Rate:</strong> &nbsp; {getPlayerChampionStats(player).winRate}%</div>
                            </div>
                            <div className="player-expanded-stats-modal-body-role-stats">
                            {Object.entries(getPlayerRoleStats(player)).map(([role, stats]) => (
                              <div key={role} className="player-expanded-stats-modal-body-role-stat-container">
                                <div className="player-expanded-stats-modal-body-role-stats-icon-container">
                                  <img
                                    src={getRoleIcon(role)}
                                    alt={role}
                                    className="player-expanded-stats-modal-body-role-stats-icon"
                                  />
                                </div>
                                <div className="player-expanded-stats-modal-body-role-stats-text-container">
                                  <div className="player-expanded-stats-modal-body-role-stats-text">
                                    W/L: {stats.wins} / {stats.losses}
                                  </div>
                                  <div className="player-expanded-stats-modal-body-role-stats-text">
                                    WR: {stats.winRate}%
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          </div>
                          <div className="player-expanded-stats-modal-body-right">
                            {Object.entries(getPlayerChampionStats(player).championStats).map(([champion, stats]) => (
                              <div key={champion} className="player-expanded-stats-modal-body-champion-stats-container">
                                <img src={getChampionIcon(champion)} alt={champion} className="player-expanded-stats-modal-body-champion-icon"/>
                                <div className="player-expanded-stats-modal-body-champion-stat">Games: {stats.games}</div>
                                <div className="player-expanded-stats-modal-body-champion-stat">Wins: {stats.wins}</div>
                                <div className="player-expanded-stats-modal-body-champion-stat">Losses: {stats.losses}</div>
                                <div className="player-expanded-stats-modal-body-champion-stat">
                                  W/R: {((stats.wins / stats.games) * 100).toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    </>
                  ))}
                </div>
              </div>
              
            </div>
        </div>
      </div>
  );
}
