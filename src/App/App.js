import React, { Component } from 'react';
import RecentTopicsContainer from '../RecentTopicsContainer/RecentTopicsContainer';
import LobbyistListContainer from '../LobbyistListContainer/LobbyistListContainer';
import LobbyistShow from '../LobbyistShow/LobbyistShow';
import { Route, Switch, NavLink } from 'react-router-dom';
import {
  initialFetchCall,
  lobbyistFetchCall,
  wordCloudFetch,
  lobbyistListFetchCall,
  specificWordFetch
} from '../Utils/apiCalls';
import ModalContainer from '../ModalContainer/ModalContainer';
import WordCloud from 'react-d3-cloud';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      recentTopics: [],
      lobbyistList: [],
      wordCloud: [],
      showLobbyists: [],
      showWords: [],
      currentId: '',
      errors: '',
      active: false,
      loading: true
    };
  }

  setInitialState = async () => {
    if (!this.state.recentTopics.length) {
      try {
        const recentTopics = await initialFetchCall();
        this.setState({ recentTopics, loading: false });
      } catch (error) {
        this.setState({ errors: error.message });
      }
    }
  };

  setWordCloud = async () => {
    if (!this.state.wordCloud.length) {
      try {
        const wordCloud = await wordCloudFetch();
        this.setState({ wordCloud, loading: false });
      } catch (error) {
        this.setState({ errors: error.message });
      }
    }
  };

  setCurrentId = () => {
    return setTimeout(() => {
      const { pathname } = window.location;
      const pathValue = pathname.split('/').pop();
      this.setState({ currentId: pathValue }, () => pathValue);
    }, 1);
  };

  fetchLobbyists = async () => {
    if (!this.state.lobbyistList.length) {
      try {
        const lobbyistList = await lobbyistFetchCall();
        this.setState({ lobbyistList, loading: false });
      } catch (error) {
        this.setState({ error: error.message });
      }
    }
  };

  fetchLobbyistList = async id => {
    try {
      const showLobbyists = await lobbyistListFetchCall(id);
      this.setState({
        showLobbyists,
        loading: false
      });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  toggleClass = () => {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  };

  fontSizeMapper = word => Math.log2(word.value) * 9;

  onWordClick = async word => {
    try {
      const showWords = await specificWordFetch(word.text);
      this.setState({
        showWords,
        loading: false
      });
    } catch (error) {
      this.setState({ error: error.message });
    }
    this.toggleClass();
  };

  render() {
    return (
      <div>
        <section className="hero is-primary is-small">
          <div className="hero-head">
            <nav className="navbar">
              <div className="container">
                <div className="navbar-brand">
                  <a className="navbar-item">
                    <NavLink exact to="/">
                      INFORMANT
                    </NavLink>
                  </a>
                  <span
                    className="navbar-burger burger"
                    data-target="navbarMenuHeroA"
                  >
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <div id="navbarMenuHeroA" className="navbar-menu">
                  <div className="navbar-end">
                    <a className="navbar-item">
                      <NavLink exact to="/most_recent">
                        View Recent
                      </NavLink>
                    </a>
                    <a className="navbar-item">
                      <NavLink exact to="/lobbyists">
                        View Lobbyists
                      </NavLink>
                    </a>
                    <a className="navbar-item">
                      <NavLink exact to="/issues">
                        View Issues
                      </NavLink>
                    </a>
                    <span className="navbar-item">
                      <a
                        className="button is-primary is-inverted"
                        href="https://www.propublica.org/"
                      >
                        <span className="icon">
                          <i className="fab fa-product-hunt" />
                        </span>
                        <span>ProPublica</span>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </section>
        <section className="hero is-fullheight">
          <div className="hero-body">
            <div className="hero-body">
              <div className="container has-text-centered">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => {
                      return (
                        <h1>
                          Welcome to informant. This website is here to track
                          lobbyist activity within the Federal Government. You
                          can view the 30 most recent lobbyist filings. You can
                          view the most commonly referenced issues based on word
                          frequency. An archive of all existing lobbyist memos
                          is available below via the archive link.
                        </h1>
                      );
                    }}
                  />
                  <Route
                    exact
                    path="/most_recent"
                    render={() => {
                      this.setInitialState();
                      return (
                        <RecentTopicsContainer
                          recentTopicsCategory={this.state.recentTopics}
                          setCurrentId={this.setCurrentId}
                          fetchLobbyData={this.fetchLobbyistList}
                        />
                      );
                    }}
                  />
                  <Route
                    exact
                    path="/lobbyists"
                    render={() => {
                      this.fetchLobbyists();
                      return (
                        <LobbyistListContainer
                          lobbyistListCategory={this.state.lobbyistList}
                        />
                      );
                    }}
                  />
                  <Route
                    exact
                    path="/issues"
                    render={() => {
                      this.setWordCloud();
                      return (
                        <div>
                          <h1 className="title">Frequently Mentioned Words</h1>
                          <h1 className="subtitle">
                            Click on a word to view related lobbying filings
                          </h1>
                          <WordCloud
                            data={this.state.wordCloud}
                            fontSizeMapper={this.fontSizeMapper}
                            width={1320}
                            height={900}
                            onWordClick={this.onWordClick}
                            padding={5}
                          />
                        </div>
                      );
                    }}
                  />
                  <Route
                    exact
                    path={`/lobbyists/${this.state.currentId}`}
                    render={() => {
                      const { showLobbyists } = this.state;
                      return <LobbyistShow lobbyist={showLobbyists} />;
                    }}
                  />
                </Switch>
              </div>
              <div
                className={`modal ${this.state.active ? 'is-active' : ''}`}
                onClick={this.toggleClass}
              >
                <div className="modal-background" />
                <div className="modal-content">
                  <ModalContainer modal={this.state.showWords} />
                </div>
                <button className="modal-close is-large" aria-label="close" />
              </div>
            </div>
          </div>
          <div className="hero-foot">
            <nav className="tabs">
              <div className="container">
                <ul>
                  <li className="is-active">
                    <a>Overview</a>
                  </li>
                  <li>
                    <a>Modifiers</a>
                  </li>
                  <li>
                    <a>Grid</a>
                  </li>
                  <li>
                    <a>Elements</a>
                  </li>
                  <li>
                    <a>Components</a>
                  </li>
                  <li>
                    <a>Layout</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
