import React from "react";

import "./style.css";

type PropsType = {
  className?: string
};

const SearchInput = ({ className, ...props }: PropsType) => (
  <input className={className} styleName="root" {...props} />
);

SearchInput.defaultProps = {
  className: null
};

export default SearchInput;