import React from "react";
import { groupByAppName, groupByDescriptionTag } from "../../../../../src/grouping/Grouper";
import "./index.css";
import Mermaid from "../../../Mermaid";

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
};

export function ArchitectureDiagram({ subscriptionAndResources }: ArchitectureDiagramProps) {
  if (!subscriptionAndResources) {
    return <></>;
  }
      
  const { Subscription: subscription, Resources: resources } = subscriptionAndResources;

  const header = `C4Context
title Azure Architecture Overview
`;
  
  return (
    <div id="architecture-diagram">
      <Mermaid chart={header + renderSubscription(subscription, resources)} />
    </div>
  );
}

// Component for rendering a subscription
function renderSubscription(subscription: Subscription, resources: AzureResource[]): string {
  const id = `subscription-${subscription.displayName.replace(/\s+/g, '-')}`;
  const apps = groupByAppName(resources);
  
  const applicationGroups = Object.keys(apps)
    .map(appName => renderApplicationGroup(appName, apps[appName]))
    .filter(group => group.length > 0)
    .join("\n\t");
    
  if (!applicationGroups) {
    return "";
  }

  return `Boundary(${id}, "${subscription.displayName}", "Azure Subscription") {
    ${applicationGroups}
  }`;
}

// Component for rendering an application group
function renderApplicationGroup(appName: string, resources: AzureResource[]): string {
  const sites = resources.filter(resource => resource.type.toLowerCase() === "microsoft.web/sites");
  
  if (sites.length === 0) {
    return "";
  }
  
  const groupedByDescriptionTag = groupByDescriptionTag(sites);
  const groupId = `app-${appName.replace(/\s+/g, '-')}`;
  
  // Group resources with the same description across different regions
  const groupedResources = Object.keys(groupedByDescriptionTag).map(description => {
    const resourcesWithSameDescription = groupedByDescriptionTag[description];
    
    const installations = resourcesWithSameDescription.map((site: { name: any; location: any; }) => ({
      name: site.name,
      location: site.location
    }));
    
    return {
      ...resourcesWithSameDescription[0],
      installations
    } as GroupedResource;
  });
  
  if (groupedResources.length === 0) {
    return "";
  }
  
  const systemComponents = groupedResources.map(resource => renderResource(resource)).join("\n\t");
  
  return `Boundary(${groupId}, "${appName}", "Application Group") {
    ${systemComponents}
  }`;
}

// Component for rendering a resource with region pairing
function renderResource(resource: GroupedResource): string {
  const description = resource.tags.description || resource.name;
  const installations = resource.installations || [];
  
  // Generate a stable ID from the resource name
  const id = resource.name.replace(/[^a-zA-Z0-9]/g, '');
  
  // Group installations by paired regions
  const pairedRegions = groupPairedRegions(installations);
  
  let locationInfo = "";
  if (pairedRegions.length > 0) {
    locationInfo = pairedRegions.map(pair => 
      pair.regions.join(" + ")
    ).join(", ");
  } else if (installations.length > 0) {
    locationInfo = installations.map(i => i.location).join(", ");
  }
  
  return `System(${id}, "${description}", "${resource.name}\\n${locationInfo}")`;
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