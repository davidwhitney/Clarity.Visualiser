type AzureResourcesGroupedBySubscriptionId = {
    [subscriptionId: string]: any;
};

type SingleSubscriptionGroupedByTeam = {
    [teamName: string]: any;
};

type SubscriptionAndResources = {
    Subscription: Subscription;
    Resources: any[];
}

type Subscription = {
    subscriptionId: string;
    displayName: string;
}