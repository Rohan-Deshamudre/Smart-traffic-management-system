#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

from ndw import listener
from subscription import broadcast


def main():
    os.environ.setdefault(
        'DJANGO_SETTINGS_MODULE',
        'scenwise_backend.settings')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    if 'test' not in sys.argv:
        listener.start_update()
        broadcast.start()
        listener.start_daily_update()
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
