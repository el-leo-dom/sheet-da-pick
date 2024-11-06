'use client'

import { useState, useEffect } from "react";
import './MainPage.css'
import { displayRank } from './displayRank.js'

export default function Home() {
  const [sidebarChoice, setSidebarChoice] = useState('sheetdapick') // sheetdapick, leaderboard
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    const response = await fetch('/api/admin/users');
    const data = await response.json();
    // Sort players by LP in descending order before setting state
    const sortedPlayers = data.sort((a, b) => b.lpPick - a.lpPick);
    setPlayers(sortedPlayers);
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
                  Top Ganhos de LP da Semana
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
                    <div className="mainpage-content-sheet-list-topbar-games">
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
                        <div className="mainpage-content-sheet-list-lp">
                          {displayRank(player.lpPick)}
                        </div>
                        <div className="mainpage-content-sheet-list-lp">
                          {player.lpPick}
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
