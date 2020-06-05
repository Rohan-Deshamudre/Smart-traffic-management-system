from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Deletes specified user."

    def add_arguments(self, parser):
        parser.add_argument("username", nargs=1, type=str)

    def handle(self, *args, **options):
        username = options["username"][0]

        try:
            user = User.objects.get(username=username)
            user.delete()

            self.stdout.write(
                self.style.SUCCESS(
                    "Succesfully deleted user with username: '%s'" % username
                )
            )
            return
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR("User with username '%s' doesnt exist." % username)
            )
            return

        except Exception as e:
            self.stdout.write(self.style.ERROR("Something went wrong. %s" % e))
            return
