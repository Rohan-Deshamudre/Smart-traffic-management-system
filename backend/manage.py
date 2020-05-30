#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

from subscription import broadcast
from decision_support import decision_module


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
        broadcast.start()
        decision_module.start()
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
