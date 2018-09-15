import React from "react";

import SearchInput from "../search-input";
import Feature from "../feature";

import "./style.css";

type ListPropsType = {
  features: any[]
};

type ViewPropsType = ListPropsType & {
  query?: string,
  onQueryChange: string => void
};

function getMatchingFeatures(features, query) {
  const pattern = new RegExp(query, "i");
  const matchingFeatures = features.filter(
    f => f.title.match(pattern) || f.description.match(pattern)
  );

  return matchingFeatures;
}

const FeaturesList = ({ features }: ListPropsType) => (
  <div styleName="features">
    {features.map(feature => (
      <Feature key={feature.id} {...feature} />
    ))}
  </div>
);

const FeaturesView = ({ features, query, onQueryChange }: ViewPropsType) => {
  const matchingFeatures = getMatchingFeatures(features, query);

  return (
    <div styleName="root">
      <SearchInput
        styleName="searchbox"
        placeholder="Search for a feature"
        value={query}
        onChange={e => onQueryChange(e.target.value)}
      />
      {matchingFeatures.length ? (
        <FeaturesList features={matchingFeatures} />
      ) : (
        <div styleName="notice">No features matched your search terms.</div>
      )}
    </div>
  );
};

FeaturesView.defaultProps = {
  query: null
};

export default FeaturesView;