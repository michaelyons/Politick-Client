import React from 'react';

const LoginSuccess = currentUser => {
  return (
    <div>
      <a href="https://ml-politick-server.herokuapp.com/">
        {`WELCOME ${currentUser.currentUser}`} <i className="fab fa-twitter" />
      </a>
    </div>
  );
};

export default LoginSuccess;
