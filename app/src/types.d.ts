type AzureResourcesGroupedBySubscriptionId = {
    [subscriptionId: string]: any;
};

type SingleSubscriptionGroupedByTeam = {
    [teamName: string]: any;
};

type SubscriptionAndResources = {
    Subscription: any;
    Resources: any[];
}