import React from 'react';
import PropTypes from 'prop-types';
import LobbyCard from '../LobbyCard/LobbyCard';

const RecentTopicsContainer = ({
  recentTopicsCategory,
  setCurrentId,
  fetchLobbyData
}) => {
  const lobbyCard = recentTopicsCategory.map((topic, index) => (
    <LobbyCard
      setCurrentId={setCurrentId}
      {...topic}
      key={index}
      fetchLobbyData={fetchLobbyData}
    />
  ));
  return <div>{lobbyCard}</div>;
};

RecentTopicsContainer.propTypes = {
  recentTopicsCategory: PropTypes.array,
  setCurrentId: PropTypes.func,
  fetchLobbyData: PropTypes.func
};

export default RecentTopicsContainer;
