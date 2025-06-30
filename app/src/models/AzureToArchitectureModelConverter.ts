import { AzureResource, Subscription } from '../types';
import { ArchitectureModel, ArchitectureNode, ArchitectureEdge, NodeType } from './ArchitectureModel';

/**
 * Converts Azure resources into our intermediate architecture model
 */
export class AzureToArchitectureModelConverter {
  /**
   * Convert Azure resources to an architecture model
   */
  public convert(subscription: Subscription, resources: AzureResource[]): ArchitectureModel {
    const nodes: ArchitectureNode[] = [];
    const edges: ArchitectureEdge[] = [];
    const resourceGroups = new Set<string>();
    
    // Create subscription node as the root
    nodes.push({
      id: subscription.subscriptionId,
      name: subscription.displayName,
      type: 'boundary',
      description: `Azure Subscription: ${subscription.displayName}`,
    });

    // Filter out alert resources
    const filteredResources = resources.filter(resource => !this.isAlertResource(resource.type));

    // Process all resources (excluding alerts)
    filteredResources.forEach(resource => {
      // Extract resource group name
      const rgName = this.extractResourceGroupName(resource.id);
      resourceGroups.add(rgName);
      
      // Create node for the Azure resource
      nodes.push({
        id: resource.id,
        name: resource.name,
        type: this.mapAzureTypeToNodeType(resource.type),
        description: `${resource.type}: ${resource.name}`,
        parent: rgName,
        locations: resource.location,
        metadata: {
          azureType: resource.type,
          tags: resource.tags,
          properties: resource.properties
        }
      });

      // Connect to parent resource group
      edges.push({
        source: rgName,
        target: resource.id,
        label: 'contains'
      });
      
      // Process dependencies if available
      if (resource.properties && resource.properties.dependencies) {
        resource.properties.dependencies.forEach(dep => {
          edges.push({
            source: resource.id,
            target: dep.id,
            label: dep.type || 'depends-on'
          });
        });
      }
    });

    // Create resource group nodes
    resourceGroups.forEach(rgName => {
      nodes.push({
        id: rgName,
        name: this.getShortName(rgName),
        type: 'resource-group',
        description: `Resource Group: ${rgName}`,
        parent: subscription.subscriptionId
      });
      
      // Connect to subscription
      edges.push({
        source: subscription.subscriptionId,
        target: rgName,
        label: 'contains'
      });
    });

    return {
      nodes,
      edges,
      metadata: {
        title: `Azure Architecture - ${subscription.displayName}`,
        created: new Date().toISOString(),
        subscriptionId: subscription.subscriptionId
      }
    };
  }
  
  /**
   * Maps Azure resource types to our architecture node types
   */
  private mapAzureTypeToNodeType(azureType: string): NodeType {
    if (azureType.includes('microsoft.web/sites')) {
      return 'system';
    } else if (azureType.includes('microsoft.web/serverfarms')) {
      return 'resource-type';
    } else if (azureType.includes('microsoft.storage/storageaccounts')) {
      return 'resource-type';
    } else if (azureType.includes('microsoft.documentdb')) {
      return 'resource-type';
    } else if (azureType.includes('microsoft.servicefabric')) {
      return 'system';
    } else {
      return 'associated';
    }
  }
  
  /**
   * Extracts resource group name from Azure resource ID
   */
  private extractResourceGroupName(resourceId: string): string {
    const match = resourceId.match(/\/resourceGroups\/([^\/]+)/i);
    return match ? match[1] : 'unknown-resource-group';
  }
  
  /**
   * Gets a short name from a longer identifier
   */
  private getShortName(name: string): string {
    // Return last part after last slash or the whole name if no slash
    return name.includes('/') ? name.split('/').pop()! : name;
  }

  /**
   * Checks if the resource type is an alert resource
   */
  private isAlertResource(resourceType: string): boolean {
    return resourceType.includes('microsoft.insights/alertRules') ||
           resourceType.includes('microsoft.insights/activityLogAlerts') || 
           resourceType.includes('microsoft.alertsmanagement');
  }

  /**
   * Convert multiple subscriptions' resources to a single architecture model
   */
  public convertMultipleSubscriptions(allSubs: { Subscription: Subscription, Resources: AzureResource[] }[]): ArchitectureModel {
    const nodes: ArchitectureNode[] = [];
    const edges: ArchitectureEdge[] = [];
    
    // Create a root node for all subscriptions
    const rootId = 'azure-root';
    nodes.push({
      id: rootId,
      name: 'Azure',
      type: 'boundary',
      description: 'Azure Cloud Environment',
    });
    
    // Process each subscription
    allSubs.forEach(subAndRes => {
      // Convert using the single subscription method
      const subModel = this.convert(subAndRes.Subscription, subAndRes.Resources);
      
      // Add all nodes and edges from this subscription
      nodes.push(...subModel.nodes);
      edges.push(...subModel.edges);
      
      // Connect subscription to the root
      edges.push({
        source: rootId,
        target: subAndRes.Subscription.subscriptionId,
        label: 'contains'
      });
    });
    
    return {
      nodes,
      edges,
      metadata: {
        title: `Multi-Subscription Azure Architecture`,
        created: new Date().toISOString()
      }
    };
  }
}