// app/admin/AdminPage.js
'use client';

import { useState, useEffect } from 'react';
import './AdminPage.css';
import { password } from './password.js'
import { champions } from '../icons/champs/champsArray.js'

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', lpPick: 1350, profilePic: '' });
  const [editUser, setEditUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [editGameId, setEditGameId] = useState(null);
  const [editGame, setEditGame] = useState(null);

  const [newGame, setNewGame] = useState({
    teamRed: Array(5).fill({ playerId: null, champion: null }),
    teamBlue: Array(5).fill({ playerId: null, champion: null }),
    winningTeam: 'TEAM_RED',
  });

  useEffect(() => {
    fetchUsers();
    fetchGames();
  }, []);

  async function fetchUsers() {
    const response = await fetch('/api/admin/users');
    const data = await response.json();
    setUsers(data);
  }

  async function fetchGames() {
    const response = await fetch('/api/admin/games');
    const data = await response.json();
    console.log(data)
    setGames(data);
  }

  async function addUser() {
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    fetchUsers();
    setNewUser({ name: '', lpPick: 0, profilePic: '' });
  }

  async function updateUser() {
    await fetch(`/api/admin/users/${editUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUser),
    });
    fetchUsers();
    setEditUser(null);
  }


  async function addGame() {
    const { teamRed, teamBlue, winningTeam } = newGame;

    // Ensure each team has players, champions, and lanes selected
  if (teamRed.some(({ playerId, champion, lane }) => !playerId || !champion || !lane) ||
    teamBlue.some(({ playerId, champion, lane }) => !playerId || !champion || !lane)) {
  alert('Each team must have 5 unique players with champions and lanes selected.');
  return;
  }

    const playerChampionPairs = [
      ...teamRed.map((selection) => ({ 
        playerId: selection.playerId, 
        champion: selection.champion,
        lane: selection.lane })),
      ...teamBlue.map((selection) => ({ 
        playerId: selection.playerId,
         champion: selection.champion,
         lane: selection.lane })),
    ];

    await fetch('/api/admin/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamRed, teamBlue, winningTeam, playerChampionPairs }),
    });
    fetchGames();
    setNewGame({ teamRed: Array(5).fill({ playerId: 0, champion: '' }), teamBlue: Array(5).fill({ playerId: 0, champion: '' }), winningTeam: 'TEAM_RED' });
  }

  async function deleteUser(id) {
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  }


  async function deleteGame(id) {
    await fetch(`/api/admin/games/${id}`, { method: 'DELETE' });
    fetchGames();
  }

  function handleChampionSelection(team, index, key, value) {
    setNewGame((prevGame) => {
      const updatedTeam = [...prevGame[team]];
      updatedTeam[index] = { ...updatedTeam[index], [key]: value };
  
      return {
        ...prevGame,
        [team]: updatedTeam,
      };
    });
  }
  

  
  function getAvailablePlayers(team, index) {
    const selectedPlayers = new Set([
      ...newGame.teamRed.map((selection) => selection.playerId),
      ...newGame.teamBlue.map((selection) => selection.playerId),
    ]);
    const currentPlayerId = newGame[team][index].playerId;
    return users.filter((user) => !selectedPlayers.has(user.id) || user.id === currentPlayerId);
  }

  function getAvailableChampions(team, index) {
    const selectedChampions = new Set([
      ...newGame.teamRed.map((selection) => selection.champion),
      ...newGame.teamBlue.map((selection) => selection.champion),
    ]);
    const currentChampion = newGame[team][index].champion;
    return champions.filter((champ) => !selectedChampions.has(champ.name) || champ.name === currentChampion);
  }




  function handlePasswordSubmit() {
    if (inputPassword === password) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  }


  function handleEditGame(game) {
    setEditGameId(game.id);
    setEditGame({
      ...game,
      teamRed: game.teamRed.map((player) => ({
        playerId: player.id,
        champion: player.championSelections[0]?.champion || '',
        lane: player.championSelections[0]?.lane || 'NONE'
      })),
      teamBlue: game.teamBlue.map((player) => ({
        playerId: player.id,
        champion: player.championSelections[0]?.champion || '',
        lane: player.championSelections[0]?.lane || 'NONE'
      })),
    });
  }

  async function saveEditedGame() {
    const { teamRed, teamBlue } = editGame;

    await fetch(`/api/admin/games/${editGameId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamRed, teamBlue }),
    });

    setEditGameId(null);
    setEditGame(null);
    fetchGames();
  }

  function handlePlayerChampionChange(team, index, key, value) {
    setEditGame((prev) => {
      const updatedTeam = [...prev[team]];
      updatedTeam[index] = { ...updatedTeam[index], [key]: value };
      return { ...prev, [team]: updatedTeam };
    });
  }


  
  if (!isAuthenticated) {
    return (
      <div className="password-container">
        <h2>Enter Password to Access Admin Panel</h2>
        <input
          type="password"
          placeholder="Password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
        <button onClick={handlePasswordSubmit}>Enter</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>

      <section className="admin-section">
        <h3>Add User</h3>
        <input
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          placeholder="LP Pick"
          type="number"
          value={newUser.lpPick}
          onChange={(e) => setNewUser({ ...newUser, lpPick: Number(e.target.value) })}
        />
        <input
          placeholder="Profile Picture URL"
          value={newUser.profilePic}
          onChange={(e) => setNewUser({ ...newUser, profilePic: e.target.value })}
        />
        <button onClick={addUser}>Add User</button>
      </section>


      <section className="admin-section">
  <h3>Add Game</h3>

  <div className="team-select-grid">
  <h4>Team Red</h4>
  {newGame.teamRed.map((selection, index) => (
    <div key={`teamRed-${index}`} className="player-champion-selection">
      <select
        value={selection.playerId || ''}
        onChange={(e) => handleChampionSelection('teamRed', index, 'playerId', parseInt(e.target.value))}
      >
        <option value="">Select Player</option>
        {getAvailablePlayers('teamRed', index).map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <select
        value={selection.champion || ''}
        onChange={(e) => handleChampionSelection('teamRed', index, 'champion', e.target.value)}
      >
        <option value="">Select Champion</option>
        {getAvailableChampions('teamRed', index).map((champ) => (
          <option key={champ.name} value={champ.name}>
            {champ.name}
          </option>
        ))}
      </select>
      <select
        value={selection.lane || 'NONE'}
        onChange={(e) => handleChampionSelection('teamRed', index, 'lane', e.target.value)}
      >
        {['NONE', 'TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT'].map((lane) => (
          <option key={lane} value={lane}>
            {lane}
          </option>
        ))}
      </select>
    </div>
  ))}
</div>



<div className="team-select-grid">
  <h4>Team Blue</h4>
  {newGame.teamBlue.map((selection, index) => (
    <div key={`teamBlue-${index}`} className="player-champion-selection">
      <select
        value={selection.playerId || ''}
        onChange={(e) => handleChampionSelection('teamBlue', index, 'playerId', parseInt(e.target.value))}
      >
        <option value="">Select Player</option>
        {getAvailablePlayers('teamBlue', index).map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <select
        value={selection.champion || ''}
        onChange={(e) => handleChampionSelection('teamBlue', index, 'champion', e.target.value)}
      >
        <option value="">Select Champion</option>
        {getAvailableChampions('teamBlue', index).map((champ) => (
          <option key={champ.name} value={champ.name}>
            {champ.name}
          </option>
        ))}
      </select>
      <select
        value={selection.lane || 'NONE'}
        onChange={(e) => handleChampionSelection('teamBlue', index, 'lane', e.target.value)}
      >
        {['NONE', 'TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT'].map((lane) => (
          <option key={lane} value={lane}>
            {lane}
          </option>
        ))}
      </select>
    </div>
  ))}
</div>


  <div>
    <label>Winning Team:</label>
    <select
      value={newGame.winningTeam}
      onChange={(e) => setNewGame({ ...newGame, winningTeam: e.target.value })}
    >
      <option value="TEAM_RED">Team Red</option>
      <option value="TEAM_BLUE">Team Blue</option>
    </select>
  </div>
  <button onClick={addGame}>Create Game</button>
</section>


      <section className="admin-section">
        <h3>Games</h3>
        <ul className="game-list">
          {games.map((game) => (
            <li key={game.id} className="game-item">
              <div>
                Game #{game.id} - Winning Team: {game.winningTeam}
              </div>
              <button onClick={() => handleEditGame(game)}>Edit</button>
              <button onClick={() => deleteGame(game.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
      {/* Edit Game Modal */}
      {editGameId && (
            <div className="edit-game-modal">
              <h3>Edit Game #{editGameId}</h3>
              <div className="team-select-grid">
                <h4>Team Red</h4>
                {editGame.teamRed.map((selection, index) => (
                  <div key={`teamRed-${index}`} className="player-champion-selection">
                  <span className="player-name">
                    {users.find(user => user.id === selection.playerId)?.name || 'Unknown Player'}:
                  </span>
                  <select
                    value={selection.champion}
                    onChange={(e) => handlePlayerChampionChange('teamRed', index, 'champion', e.target.value)}
                  >
                    <option value="">Select Champion</option>
                    {champions.map((champ) => (
                      <option key={champ.name} value={champ.name}>
                        {champ.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selection.lane}
                    onChange={(e) => handlePlayerChampionChange('teamRed', index, 'lane', e.target.value)}
                  >
                    {['NONE', 'TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT'].map((lane) => (
                      <option key={lane} value={lane}>
                        {lane}
                      </option>
                    ))}
                  </select>
                </div>
                ))}
                <h4>Team Blue</h4>
                {editGame.teamBlue.map((selection, index) => (
                  <div key={`teamRed-${index}`} className="player-champion-selection">
                  <span className="player-name">
                    {users.find(user => user.id === selection.playerId)?.name || 'Unknown Player'}:
                  </span>
                  <select
                    value={selection.champion}
                    onChange={(e) => handlePlayerChampionChange('teamBlue', index, 'champion', e.target.value)}
                  >
                    <option value="">Select Champion</option>
                    {champions.map((champ) => (
                      <option key={champ.name} value={champ.name}>
                        {champ.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selection.lane}
                    onChange={(e) => handlePlayerChampionChange('teamBlue', index, 'lane', e.target.value)}
                  >
                    {['NONE', 'TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT'].map((lane) => (
                      <option key={lane} value={lane}>
                        {lane}
                      </option>
                    ))}
                  </select>
                </div>
                ))}
              </div>
              <button onClick={saveEditedGame}>Save</button>
              <button onClick={() => setEditGameId(null)}>Cancel</button>
            </div>
          )}
      {editUser && (
        <section className="admin-section">
          <h3>Edit User</h3>
          <input
            placeholder="Name"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <input
            placeholder="LP Pick"
            type="number"
            value={editUser.lpPick}
            onChange={(e) => setEditUser({ ...editUser, lpPick: Number(e.target.value) })}
          />
          <input
            placeholder="Games Played"
            type="number"
            value={editUser.gamesPlayedPick}
            onChange={(e) => setEditUser({ ...editUser, gamesPlayedPick: Number(e.target.value) })}
          />
          <input
            placeholder="Wins"
            type="number"
            value={editUser.winsPick}
            onChange={(e) => setEditUser({ ...editUser, winsPick: Number(e.target.value) })}
          />
          <input
            placeholder="Profile Picture URL"
            value={editUser.profilePic}
            onChange={(e) => setEditUser({ ...editUser, profilePic: e.target.value })}
          />
          <button onClick={updateUser}>Save Changes</button>
          <button onClick={() => setEditUser(null)}>Cancel</button>
        </section>
      )}

      <section className="admin-section">
        <h3>Users</h3>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-item">
              <div>
                {user.name} - LP: {user.lpPick}
              </div>
              <button onClick={() => setEditUser(user)}>Edit</button>
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
