import React from "react";
import RecommendationTable from "../tabels/visitDetails/RecommendationTable";

function Recommendation({ data, fromSummary = false }) {
  return <RecommendationTable data={data} fromSummary={fromSummary} />;
}

export default Recommendation;
