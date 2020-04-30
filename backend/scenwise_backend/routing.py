from channels.routing import include

channel_routing = [
    include("subscription.routing.app_routing"),
]
