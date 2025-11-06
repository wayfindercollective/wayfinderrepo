"use client";
import React from "react";
import "./price.css";

// Small helper to turn a string into "shards" that can fly apart on hover
function makeShards(text: string) {
  return [...text].map((ch, i) => {
    // random but stable-ish offsets so it looks organic - much larger distances to fly off screen
    const dx = (Math.random() * 800 - 400).toFixed(0) + "px";
    const dy = (Math.random() * 600 - 300).toFixed(0) + "px";
    const rot = (Math.random() * 720 - 360).toFixed(0) + "deg";
    return (
      <span
        key={i}
        className="shard"
        style={
          {
            // @ts-ignore custom props for CSS
            "--dx": dx,
            "--dy": dy,
            "--rot": rot,
          } as React.CSSProperties
        }
      >
        {ch}
      </span>
    );
  });
}

export default function Price() {
  return (
    <div className="price-wrap">
      <div className="price-row">
        <span 
          className="current-price" 
          aria-hidden="true"
        >
          $297
        </span>
        <span className="discount-note">50% Discount</span>
      </div>
      <div className="meta-row">
        <span className="strike" title="Original price">
          {makeShards("$600 value")}
        </span>
        <span className="program-note">6-month program</span>
      </div>
    </div>
  );
}
