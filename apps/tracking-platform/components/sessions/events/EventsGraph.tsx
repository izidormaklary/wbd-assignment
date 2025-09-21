import { useMemo } from "react";
import { ReactFlow, Node, Edge, Controls, Background, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

interface Event {
  _id: string;
  sessionId: string;
  type: "search" | "page_view" | "add_to_cart" | "upsell" | "checkout";
  page?: string;
  timestamp: string;
}

interface EventsGraphProps {
  events: Event[];
}

const getEventTypeColor = (type: string) => {
  const colors = {
    search: "#3B82F6",
    page_view: "#10B981",
    add_to_cart: "#F59E0B",
    upsell: "#8B5CF6",
    checkout: "#EF4444",
  };
  return colors[type as keyof typeof colors] || "#6B7280";
};
export default function EventsGraph({ events }: EventsGraphProps) {
  const { nodes, edges } = useMemo(() => {
    if (!events || events.length === 0) {
      return { nodes: [], edges: [] };
    }

    // Create nodes for each event type and page
    const nodeMap = new Map<string, Node>();
    const edgeMap = new Map<string, Edge>();
    
    // Add session start node
    const sessionStartId = "session-start";
    nodeMap.set(sessionStartId, {
      id: sessionStartId,
      type: "default",
      position: { x: 100, y: 100 },
      data: { 
        label: "Session Start",
        type: "session",
        timestamp: events[0]?.timestamp
      },
      style: {
        background: "#10B981",
        color: "white",
        border: "2px solid #059669",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: "bold"
      }
    });

    // Process events chronologically
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    let previousNodeId = sessionStartId;
    let yPosition = 200;
    let xPosition = 100;

    sortedEvents.forEach((event, index) => {
      const nodeId = `event-${event._id}`;
      const nodeLabel = `${event.type}${event.page ? `\n${event.page}` : ""}`;
      
      // Create event node
      nodeMap.set(nodeId, {
        id: nodeId,
        type: "default",
        position: { x: xPosition, y: yPosition },
        data: {
          label: nodeLabel,
          type: event.type,
          timestamp: event.timestamp,
          eventId: event._id
        },
        style: {
          background: getEventTypeColor(event.type),
          color: "white",
          border: "2px solid #374151",
          borderRadius: "8px",
          fontSize: "11px",
          fontWeight: "bold",
          minWidth: "100px",
          textAlign: "center"
        }
      });

      // Create edge from previous node
      const edgeId = `edge-${previousNodeId}-${nodeId}`;
      edgeMap.set(edgeId, {
        id: edgeId,
        source: previousNodeId,
        target: nodeId,
        type: "smoothstep",
        style: { stroke: "#6B7280", strokeWidth: 2 },
        animated: true
      });

      // Update positions for next node
      previousNodeId = nodeId;
      xPosition += 200;
      if (xPosition > 800) {
        xPosition = 100;
        yPosition += 150;
      }
    });

    // Add session end node if session is completed
    const lastEvent = sortedEvents[sortedEvents.length - 1];
    if (lastEvent) {
      const sessionEndId = "session-end";
      nodeMap.set(sessionEndId, {
        id: sessionEndId,
        type: "default",
        position: { x: xPosition, y: yPosition + 50 },
        data: { 
          label: "Session End",
          type: "session",
          timestamp: lastEvent.timestamp
        },
        style: {
          background: "#EF4444",
          color: "white",
          border: "2px solid #DC2626",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: "bold"
        }
      });

      // Connect last event to session end
      const finalEdgeId = `edge-${previousNodeId}-${sessionEndId}`;
      edgeMap.set(finalEdgeId, {
        id: finalEdgeId,
        source: previousNodeId,
        target: sessionEndId,
        type: "smoothstep",
        style: { stroke: "#6B7280", strokeWidth: 2 },
        animated: true
      });
    }

    return {
      nodes: Array.from(nodeMap.values()),
      edges: Array.from(edgeMap.values())
    };
  }, [events]);

  

  if (!events || events.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No events to display
      </div>
    );
  }

  return (
    <div className="h-96 w-full border border-gray-200 rounded-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.1 }}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node) => node.data?.type === 'session' ? '#6B7280' : getEventTypeColor(node.data?.type)}
          nodeStrokeWidth={3}
          nodeBorderRadius={2}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
}