import React from "react";
import { groupByAppName, groupByDescriptionTag } from "../../../../../src/grouping/Grouper";
import "./index.css";
import D3Diagram, { D3Graph, D3Node, D3Edge } from "../../../D3Diagram";

// Define proper types for our data
type AzureResource = {
  id: string;
  name: string;
  type: string;
  location: string;
  tags: {
    [key: string]: string;
    description?: string;
    app?: string;
  };
  [key: string]: any;
};

type Subscription = {
  id: string;
  displayName: string;
  [key: string]: any;
};

type SubscriptionAndResources = {
  Subscription: Subscription;
  Resources: AzureResource[];
};

type ResourceLocation = {
  name: string;
  location: string;
};

type GroupedResource = {
  name: string;
  type: string;
  tags: { [key: string]: string };
  installations: ResourceLocation[];
  [key: string]: any;
};

type ArchitectureDiagramProps = { 
  subscriptionAndResources: SubscriptionAndResources | null;
  allSubscriptionsAndResources?: SubscriptionAndResources[] | null;
};

export function ArchitectureDiagram({ 
  subscriptionAndResources,
  allSubscriptionsAndResources
}: ArchitectureDiagramProps) {
  // Choose which data source to use
  const useAllSubscriptions = allSubscriptionsAndResources && allSubscriptionsAndResources.length > 0;
  
  if (!subscriptionAndResources && !useAllSubscriptions) {
    return <></>;
  }
      
  // Convert the data to D3 format - either all subs or just the selected one
  const d3Data = useAllSubscriptions
    ? convertAllSubscriptionsToD3Format(allSubscriptionsAndResources!)
    : convertToD3Format(subscriptionAndResources!.Subscription, subscriptionAndResources!.Resources);
  
  return (
    <div id="architecture-diagram">
      <D3Diagram data={d3Data} />
    </div>
  );
}

// Function to convert all subscriptions data to D3 format
function convertAllSubscriptionsToD3Format(allSubs: SubscriptionAndResources[]): D3Graph {
  const graph: D3Graph = {
    nodes: [],
    edges: []
  };
  
  // Add a "Cloud" root node to contain all subscriptions
  graph.nodes.push({
    id: "azure-cloud",
    name: "Azure Cloud",
    description: "All Azure Resources",
    type: "boundary"
  });
  
  // Process each subscription
  allSubs.forEach(subData => {
    const { Subscription: subscription, Resources: resources } = subData;
    
    // Add subscription as a boundary
    const subscriptionId = sanitizeId(subscription.displayName);
    graph.nodes.push({
      id: subscriptionId,
      name: subscription.displayName,
      description: "Azure Subscription",
      type: "boundary",
      parent: "azure-cloud" // Connect to the cloud root node
    });
    
    // Get applications grouped by app name
    const apps = groupByAppName(resources);
    
    // Process each application
    Object.keys(apps).forEach(appName => {
      const appResources = apps[appName];
      const sites = appResources.filter(resource => resource.type.toLowerCase() === "microsoft.web/sites");
      
      if (sites.length === 0) return;
      
      // Create application group as a boundary - include subscription in ID to avoid conflicts
      const appId = `app-${subscriptionId}-${sanitizeId(appName)}`;
      graph.nodes.push({
        id: appId,
        name: appName,
        description: "Application Group",
        type: "boundary",
        parent: subscriptionId
      });
      
      // Group resources with the same description
      const groupedByDescriptionTag = groupByDescriptionTag(sites);
      
      // Process each description group
      Object.keys(groupedByDescriptionTag).forEach(description => {
        const resourcesWithSameDescription = groupedByDescriptionTag[description];
        
        // Group installations by location
        const installations = resourcesWithSameDescription.map(site => ({
          name: site.name,
          location: site.location
        }));
        
        // Create a consolidated resource
        const resource = resourcesWithSameDescription[0];
        // Include subscription and app in ID to avoid conflicts across subscriptions
        const resourceId = `${subscriptionId}-${appId}-${sanitizeId(resource.name)}`;
        const resourceDescription = resource.tags.description || resource.name;
        
        // Get location information
        const pairedRegions = groupPairedRegions(installations);
        let locationInfo = "";
        if (pairedRegions.length > 0) {
          locationInfo = pairedRegions.map(pair => 
            pair.regions.join(" + ")
          ).join(", ");
        } else if (installations.length > 0) {
          locationInfo = installations.map(i => i.location).join(", ");
        }
        
        // Add the resource as a system node
        graph.nodes.push({
          id: resourceId,
          name: resourceDescription,
          description: resource.name,
          locations: locationInfo,
          type: "system",
          parent: appId
        });
      });
    });
  });
  
  return graph;
}

// Function to convert data to D3 format for a single subscription
function convertToD3Format(subscription: Subscription, resources: AzureResource[]): D3Graph {
  const graph: D3Graph = {
    nodes: [],
    edges: []
  };
  
  // Add subscription as a boundary
  const subscriptionId = sanitizeId(subscription.displayName);
  graph.nodes.push({
    id: subscriptionId,
    name: subscription.displayName,
    description: "Azure Subscription",
    type: "boundary"
  });
  
  // Get applications grouped by app name
  const apps = groupByAppName(resources);
  
  // Process each application
  Object.keys(apps).forEach(appName => {
    const appResources = apps[appName];
    const sites = appResources.filter((resource: { type: string; }) => resource.type.toLowerCase() === "microsoft.web/sites");
    
    if (sites.length === 0) return;
    
    // Create application group as a boundary
    const appId = `app-${sanitizeId(appName)}`;
    graph.nodes.push({
      id: appId,
      name: appName,
      description: "Application Group",
      type: "boundary",
      parent: subscriptionId
    });
    
    // Group resources with the same description
    const groupedByDescriptionTag = groupByDescriptionTag(sites);
    
    // Process each description group
    Object.keys(groupedByDescriptionTag).forEach(description => {
      const resourcesWithSameDescription = groupedByDescriptionTag[description];
      
      // Group installations by location
      const installations = resourcesWithSameDescription.map((site: { name: any; location: any; }) => ({
        name: site.name,
        location: site.location
      }));
      
      // Create a consolidated resource
      const resource = resourcesWithSameDescription[0];
      const resourceId = sanitizeId(resource.name);
      const resourceDescription = resource.tags.description || resource.name;
      
      // Get location information
      const pairedRegions = groupPairedRegions(installations);
      let locationInfo = "";
      if (pairedRegions.length > 0) {
        locationInfo = pairedRegions.map(pair => 
          pair.regions.join(" + ")
        ).join(", ");
      } else if (installations.length > 0) {
        locationInfo = installations.map((i: { location: any; }) => i.location).join(", ");
      }
      
      // Add the resource as a system node
      graph.nodes.push({
        id: resourceId,
        name: resourceDescription,
        description: resource.name,
        locations: locationInfo,
        type: "system",
        parent: appId
      });
    });
  });
  
  return graph;
}

// Function to group resources into paired regions
function groupPairedRegions(installations: ResourceLocation[]): { regions: string[] }[] {
  // Define Azure paired regions (simplified)
  const pairedRegionsMap: { [key: string]: string } = {
    "eastus": "westus",
    "westus": "eastus",
    "northeurope": "westeurope",
    "westeurope": "northeurope",
    // Add more pairs as needed
  };
  
  const processed = new Set<string>();
  const pairs: { regions: string[] }[] = [];
  
  installations.forEach(installation => {
    if (processed.has(installation.location)) {
      return;
    }
    
    processed.add(installation.location);
    const pairedRegion = pairedRegionsMap[installation.location];
    const pair = { regions: [installation.location] };
    
    // Check if the paired region exists in our installations
    const hasPairedRegion = installations.some(i => {
      if (i.location === pairedRegion) {
        processed.add(pairedRegion);
        pair.regions.push(pairedRegion);
        return true;
      }
      return false;
    });
    
    pairs.push(pair);
  });
  
  return pairs;
}

// Helper function to clean up strings for IDs
function sanitizeId(text: string): string {
  return text.replace(/[^a-zA-Z0-9]/g, '');
}