"""
Django settings for scenwise_backend project.

Generated by 'django-admin startproject' using Django 2.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
import sys

from datetime import timedelta
from datetime import datetime

from django.core import serializers

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'x$d4a$b0su8ept7u543qnu&+ppt-&q796*281dg5u@14w*$$sj'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # GraphQL
    'graphene_django',

    # Database components
    'api.scenarios',
    'api.road_segments',
    'api.road_conditions',
    'api.instruments',
    'api.routes',
    'api.simulations',
    'api.folders',
    'api.labels',
    'api.response_plans',
    # Cors
    'corsheaders',

    'channels',
    # NDW,
    'ndw.database.measurement_site',
    'ndw.database.location',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'scenwise_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')]
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Cors filter
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

WSGI_APPLICATION = 'scenwise_backend.wsgi.application'

ASGI_APPLICATION = 'scenwise_backend.routing.application'

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

# Use SQLite only for tests and MySQL for production
if 'test' in sys.argv or 'test_coverage' in sys.argv:
    DATABASES = {
        # Standard django database
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'django_users',
            'TEST': {'DEPENDENCIES': ['scenarios', 'ndw']}
        },
        # Scenarios database
        'scenarios': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'scenroads',
            'TEST': {'DEPENDENCIES': []}
        },
        'ndw': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'ndw',
            'TEST': {'DEPENDENCIES': [], 'NAME': 'test_ndw'}
        }
    }
else:
    DATABASES = {
        # Standard django database
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'django_users',
            'USER': 'tudb',
            'PASSWORD': '1234',
            'HOST': '127.0.0.1',
            'PORT': '3306',
            'TEST': {'DEPENDENCIES': ['scenarios', 'ndw']}
        },
        # Scenarios database
        'scenarios': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'scenroads',
            'USER': 'tudb',
            'PASSWORD': '1234',
            'HOST': '127.0.0.1',
            'PORT': '3306',
            'TEST': {'DEPENDENCIES': []}
        },
        'ndw': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'ndw',
            'USER': 'tudb',
            'PASSWORD': '1234',
            'HOST': '127.0.0.1',
            'PORT': '3306',
            'TEST': {'DEPENDENCIES': [], 'NAME': 'test_ndw'}
        }
    }

# Router to redirect queries to scenarios database
DATABASE_ROUTERS = ['scenwise_backend.dbrouter.DBRouter']

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

CHANNELS_WS_PROTOCOLS = ["graphql-ws", ]
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "asgi_redis.RedisChannelLayer",
        "ROUTING": "scenwise_backend.routing.channel_routing",
        "CONFIG": {
            "hosts": [("localhost", 6379)],
        },
    },

}

GRAPHENE = {
    'SCHEMA': 'scenwise_backend.schema.schema',

    'MIDDLEWARE': [
        'graphql_jwt.middleware.JSONWebTokenMiddleware',
    ],
}

def jwt_payload(user, context=None):
    username = user.get_username()
    groups = user.groups.all().values()

    if hasattr(username, 'pk'):
        username = username.pk

    payload = {
            user.USERNAME_FIELD: username,
            'exp': datetime.utcnow() + timedelta(minutes=15),
            'groups': list(groups)
            }

    return payload

GRAPHQL_JWT = {
        'JWT_VERIFY_EXPIRATION': True,
        'JWT_EXPIRATION_DELTA': timedelta(minutes=15),
        'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),
        'JWT_PAYLOAD_HANDLER': jwt_payload
        }

AUTHENTICATION_BACKENDS = [
    'graphql_jwt.backends.JSONWebTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Amsterdam'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'


