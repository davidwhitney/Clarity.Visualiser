import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Define types for our architecture visualization
type D3Node = {
  id: string;
  name: string;
  description: string;
  type: "system" | "boundary";
  parent?: string;
  locations?: string;
  value?: number; // For circle packing we need a value to determine size
};

type D3Edge = {
  source: string;
  target: string;
  label?: string;
};

type D3Graph = {
  nodes: D3Node[];
  edges: D3Edge[];
};

type D3DiagramProps = {
  data: D3Graph;
};

export default function D3Diagram({ data }: D3DiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    renderCirclePackingDiagram(svgRef.current, data);

    // Add resize handler
    const handleResize = () => {
      if (svgRef.current) {
        renderCirclePackingDiagram(svgRef.current, data);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return (
    <div className="d3-diagram">
      <svg ref={svgRef} width="100%" height="100%"></svg>
      <div className="diagram-title">Architecture Diagram</div>
    </div>
  );
}

function renderCirclePackingDiagram(svgElement: SVGSVGElement, graph: D3Graph) {
  // Clear previous diagram
  d3.select(svgElement).selectAll("*").remove();
  
  const width = svgElement.clientWidth || window.innerWidth;
  const height = svgElement.clientHeight || window.innerHeight;
  
  // Build hierarchical data structure for circle packing
  const hierarchyData = buildHierarchyForPacking(graph.nodes);
  
  // Create the SVG container
  const svg = d3.select(svgElement)
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .style("display", "block")
    .style("background", "#1d1e26")
    .style("cursor", "pointer");
  
  // Add a container for the entire diagram with zoom capabilities
  const g = svg.append("g");
  
  // Set up color scale for different levels of hierarchy
  const color = d3.scaleLinear()
    .domain([0, 3])
    .range(["#282a36", "#6272a4"])
    .interpolate(d3.interpolateHcl);
  
  // Create a pack layout
  const pack = d3.pack()
    .size([width - 20, height - 20])
    .padding(3);
  
  // Create the root node for our hierarchy
  const root = d3.hierarchy(hierarchyData)
    .sum(d => d.value || 1)
    .sort((a, b) => b.value! - a.value!);
  
  // Generate the layout
  const packedData = pack(root);
  
  let focus = root;
  let view: [number, number, number] = [root.x, root.y, root.r * 2];
  
  // Create circles for each node
  const node = g.selectAll("circle")
    .data(packedData.descendants())
    .enter()
    .append("circle")
      .attr("class", d => d.children ? "node" : "node node--leaf")
      .style("fill", d => d.children ? color(d.depth) : "#ff79c6")
      .style("fill-opacity", d => d.children ? 0.3 : 0.7)
      .style("stroke", "#6272a4")
      .style("stroke-width", d => d.depth === 0 ? 0 : 1)
      .on("click", (event, d) => {
        if (focus !== d) {
          zoom(event, d);
          event.stopPropagation();
        }
      });

  // Create label containers for better organization
  const labelGroups = g.selectAll(".label-group")
    .data(packedData.descendants())
    .enter()
    .append("g")
    .attr("class", "label-group")
    .style("pointer-events", "none");
  
  // Add primary labels (names) to each circle
  const label = labelGroups.append("text")
    .attr("class", "primary-label")
    .style("fill", "#f8f8f2")
    .style("font-size", d => {
      // Adjust font size based on circle size and depth
      const circleSize = d.r * 2;
      const baseFontSize = d.depth === 0 ? 20 : d.depth === 1 ? 16 : 12;
      return Math.min(baseFontSize, circleSize / 10) + "px";
    })
    .style("font-weight", d => d.depth <= 1 ? "bold" : "normal")
    .style("text-anchor", "middle")
    .style("dominant-baseline", "middle")
    .style("fill-opacity", d => shouldShowLabel(d, focus) ? 1 : 0)
    .text(d => d.data.name);
  
  // Add description text for leaf nodes
  const description = labelGroups.filter(d => !d.children)
    .append("text")
    .attr("class", "description")
    .style("fill", "#f1fa8c")
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .style("dominant-baseline", "middle")
    .style("fill-opacity", 0)
    .attr("dy", "1.2em")
    .text(d => d.data.description);
  
  // Add location info for leaf nodes with location data
  const locations = labelGroups.filter(d => !d.children && d.data.locations)
    .append("text")
    .attr("class", "location")
    .style("fill", "#f1fa8c")
    .style("font-size", "8px")
    .style("text-anchor", "middle")
    .style("dominant-baseline", "middle") 
    .style("fill-opacity", 0)
    .attr("dy", "2.4em")
    .text(d => d.data.locations || "");
  
  // Handle zoom events
  svg.on("click", (event) => zoom(event, root));
  
  zoomTo([root.x, root.y, root.r * 2]);
  
  // Helper function to determine if a label should be visible
  function shouldShowLabel(d: d3.HierarchyNode<any>, currentFocus: d3.HierarchyNode<any>): boolean {
    // Always show current level labels
    if (d.depth === currentFocus.depth) return true;
    
    // Show immediate children labels if they're big enough
    if (d.parent === currentFocus && d.r > 20) return true;
    
    // Show parent label when zoomed in
    if (d === currentFocus.parent) return true;
    
    return false;
  }
  
  // Handle zooming to a specific node
  function zoom(event: any, d: d3.HierarchyNode<any>) {
    focus = d;
    
    const transition = g.transition()
      .duration(750)
      .tween("zoom", () => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return (t: number) => zoomTo(i(t));
      });
    
    // Update all labels based on the new focus
    updateLabelVisibility(focus, transition);
  }
  
  // Update the visibility of all labels based on current focus
  function updateLabelVisibility(currentFocus: d3.HierarchyNode<any>, transition: any) {
    // Update primary labels
    label.transition(transition)
      .style("fill-opacity", d => {
        // Show labels at current depth
        if (d.depth === currentFocus.depth) return 1;
        
        // Show children labels 
        if (d.parent === currentFocus) {
          // Only if the circle is big enough to fit text
          return d.r > 20 ? 1 : 0;
        }
        
        // Show parent label
        if (d === currentFocus.parent) return 1;
        
        return 0;
      })
      .style("font-size", d => {
        // Adjust font size based on circle size and depth
        let fontSize = d.depth === 0 ? 20 : d.depth === 1 ? 16 : 12;
        
        // If this node is the focus, make it more prominent
        if (d === currentFocus) {
          fontSize = Math.max(fontSize, 14);
        }
        
        return fontSize + "px";
      });
    
    // Update description text - only visible for direct children of current focus
    description.transition(transition)
      .style("fill-opacity", d => d.parent === currentFocus ? 1 : 0)
      .attr("dy", d => d.parent === currentFocus ? "1.2em" : "0");
    
    // Update location info - only visible for direct children of current focus
    locations.transition(transition)
      .style("fill-opacity", d => d.parent === currentFocus ? 1 : 0)
      .attr("dy", d => d.parent === currentFocus ? "2.4em" : "0");
  }
  
  // Position all elements according to the zoom state
  function zoomTo(v: [number, number, number]) {
    const k = width / v[2];
    view = v;
    
    node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("r", d => d.r * k);
    
    labelGroups.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    
    // Dynamically adjust label visibility based on zoomed circle size
    label.style("fill-opacity", d => {
      const visibleByZoom = shouldShowLabel(d, focus);
      const nodeRadius = d.r * k;
      
      // Only show label if circle is big enough (radius > 15px)
      return (visibleByZoom && nodeRadius > 15) ? 1 : 0;
    });
  }
}

// Helper function to build a hierarchical data structure for circle packing
interface CirclePackNode {
  name: string;
  description: string;
  type: "system" | "boundary";
  id: string; 
  locations?: string;
  children?: CirclePackNode[];
  value?: number;
}

function buildHierarchyForPacking(nodes: D3Node[]): CirclePackNode {
  // Create a mapping of node IDs to their data
  const nodeMap = new Map<string, D3Node>();
  nodes.forEach(node => {
    nodeMap.set(node.id, { ...node });
  });
  
  // Assign placeholder values based on node type
  nodes.forEach(node => {
    if (node.type === "system") {
      node.value = 1; // Leaf nodes get a value of 1
    }
  });
  
  // Create root node (for nodes without parents)
  const rootNode: CirclePackNode = {
    name: "", // Remove "Architecture" from top circle
    description: "Complete System",
    id: "root",
    type: "boundary",
    children: []
  };
  
  // Create a mapping of parent IDs to their child nodes
  const parentToChildren = new Map<string, CirclePackNode[]>();
  
  // Initialize the map
  nodeMap.forEach((node) => {
    if (!parentToChildren.has(node.id)) {
      parentToChildren.set(node.id, []);
    }
  });
  
  // Organize nodes by their parent relationships
  nodes.forEach(node => {
    const parent = node.parent || "root";
    if (!parentToChildren.has(parent)) {
      parentToChildren.set(parent, []);
    }
    const children = parentToChildren.get(parent)!;
    
    // Create a new node for the hierarchy
    const hierarchyNode: CirclePackNode = {
      name: node.name,
      description: node.description,
      id: node.id,
      type: node.type,
      locations: node.locations,
      value: node.type === "system" ? 1 : undefined
    };
    
    // If this node has children, add them
    if (parentToChildren.has(node.id)) {
      hierarchyNode.children = parentToChildren.get(node.id);
    }
    
    // Add this node to its parent's children
    children.push(hierarchyNode);
    parentToChildren.set(parent, children);
  });
  
  // Assign the top-level children to the root
  rootNode.children = parentToChildren.get("root") || [];
  
  return rootNode;
}

export { D3Graph, D3Node, D3Edge };