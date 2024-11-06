'use client'

import { useState, useEffect } from "react";
import './MainPage.css'
import { displayRank } from './displayRank.js'
import { champions } from "./icons/champs/champsArray";

export default function Home() {
  const [sidebarChoice, setSidebarChoice] = useState('sheetdapick') // sheetdapick, leaderboard
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([])

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

  return (
      <div className="mainpage-overlay">
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
        <div className="mainpage-content-container">
        {sidebarChoice === "leaderboard" && (
            <div>
              pick
            </div>
          )}
          {sidebarChoice === "sheetdapick" && (
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
                      Vitórias
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
                    <div key={player.id} className="mainpage-content-sheet-list-item">
                        <div className="mainpage-content-sheet-list-player">
                          {player.name}
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
                  ))}
                </div>
              </div>
              
            </div>
          )}
        </div>
      </div>
  );
}
