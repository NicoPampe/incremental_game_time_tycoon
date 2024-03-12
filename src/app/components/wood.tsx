import { useState } from "react";
import Button from "./utils/button";

interface WoodI {
  woodCount: number;
}

const Wood = ({ woodCount }: WoodI) => {
  return (
    <section className="wood-main">
      <h3>Wood: {woodCount}</h3>
    </section>
  );
};

export default Wood;
