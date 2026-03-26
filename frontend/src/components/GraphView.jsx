import React from "react";
import ForceGraph2D from "react-force-graph-2d";

function GraphView({ graphData }) {
  return (
    <div style={{ flex: 1 }}>
      <ForceGraph2D
        graphData={graphData}
        backgroundColor="#020617"
        linkColor={(link) => link.color || "#999"}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;

          ctx.fillStyle = "#22c55e";
          ctx.beginPath();
          ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = "white";
          ctx.fillText(label, node.x + 8, node.y + 8);
        }}
      />
    </div>
  );
}

export default GraphView;