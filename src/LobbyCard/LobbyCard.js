import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './LobbyCard.css';

const LobbyCard = ({
  clientName,
  filingId,
  lobbyists,
  register,
  topic,
  setCurrentId,
  fetchLobbyData
}) => {
  const handleClick = async () => {
    const id = await setCurrentId();
    await fetchLobbyData(id);
  };

  const lobbyistLinks = lobbyists.map(person => (
    <Link key={person.id} to={`/lobbyists/${person.id}`} onClick={handleClick}>
      {person.name}
    </Link>
  ));

  return (
    <div className="card">
      <div className="card-content">
        <p>{topic}</p>
        <p>{filingId}</p>
        <p>{clientName}</p>
        <p>{register}</p>
        <p>{lobbyistLinks}</p>
      </div>
    </div>
  );
};

LobbyCard.propTypes = {
  clientName: PropTypes.string,
  filingId: PropTypes.number,
  lobbyists: PropTypes.array,
  register: PropTypes.string,
  topic: PropTypes.string,
  setCurrentId: PropTypes.func,
  fetchLobbyData: PropTypes.func
};

export default LobbyCard;
