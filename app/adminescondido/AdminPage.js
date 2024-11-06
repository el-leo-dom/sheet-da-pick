// app/admin/AdminPage.js
'use client';

import { useState, useEffect } from 'react';
import './AdminPage.css';
import { password } from './password.js'

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', lpPick: 0, profilePic: '' });
  const [editUser, setEditUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  const [newGame, setNewGame] = useState({
    teamRed: Array(5).fill(null),
    teamBlue: Array(5).fill(null),
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

  async function deleteUser(id) {
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  }

  async function addGame() {
    const { teamRed, teamBlue, winningTeam } = newGame;

    // Only proceed if both teams have 5 unique players selected
    if (teamRed.includes(null) || teamBlue.includes(null)) {
      alert('Each team must have 5 unique players.');
      return;
    }

    await fetch('/api/admin/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamRed, teamBlue, winningTeam }),
    });
    fetchGames();
    setNewGame({ teamRed: Array(5).fill(null), teamBlue: Array(5).fill(null), winningTeam: 'TEAM_RED' });
  }


  async function deleteGame(id) {
    await fetch(`/api/admin/games/${id}`, { method: 'DELETE' });
    fetchGames();
  }


  function getAvailablePlayers(team, index) {
    const selectedPlayers = new Set([...newGame.teamRed, ...newGame.teamBlue].filter(Boolean));
    const currentPlayerId = newGame[team][index];

    return users.filter(
      (user) => !selectedPlayers.has(user.id) || user.id === currentPlayerId
    );
  }

  function handlePlayerSelection(team, index, playerId) {
    setNewGame((prevGame) => {
      const updatedTeam = [...prevGame[team]];
      updatedTeam[index] = playerId;

      return {
        ...prevGame,
        [team]: updatedTeam,
      };
    });
  }

  function handlePasswordSubmit() {
    if (inputPassword === password) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
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
        <div className="team-select">
          <h4>Team Red</h4>
          {newGame.teamRed.map((playerId, index) => (
            <select
              key={`teamRed-${index}`}
              value={playerId || ''}
              onChange={(e) => handlePlayerSelection('teamRed', index, parseInt(e.target.value))}
            >
              <option value="">Select Player</option>
              {getAvailablePlayers('teamRed', index).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          ))}
        </div>

        <div className="team-select">
          <h4>Team Blue</h4>
          {newGame.teamBlue.map((playerId, index) => (
            <select
              key={`teamBlue-${index}`}
              value={playerId || ''}
              onChange={(e) => handlePlayerSelection('teamBlue', index, parseInt(e.target.value))}
            >
              <option value="">Select Player</option>
              {getAvailablePlayers('teamBlue', index).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
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
              <button onClick={() => deleteGame(game.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
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
