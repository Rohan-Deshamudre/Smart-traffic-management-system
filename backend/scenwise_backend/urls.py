"""scenwise_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from compression import importing, exporting
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from graphql_jwt.decorators import jwt_cookie

urlpatterns = [
    path('import/scenario', csrf_exempt(importing.handle_scenario)),
    path('export/scenario', csrf_exempt(exporting.handle_scenario)),
    path('import/instrument', csrf_exempt(importing.handle_instrument)),
    path('export/instrument', csrf_exempt(exporting.handle_instrument)),
    path('graphql/', csrf_exempt(jwt_cookie(GraphQLView.as_view(graphiql=True)))),
    path('import/responseplan', csrf_exempt(importing.handle_response_plan)),
    path('export/responseplan', csrf_exempt(exporting.handle_response_plan)),
]
