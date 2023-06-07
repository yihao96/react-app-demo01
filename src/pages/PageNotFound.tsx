import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = (): JSX.Element => {
  return (
    <div>
      <h2>Page not found!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
};

export default PageNotFound;
