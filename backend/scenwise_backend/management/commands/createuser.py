from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User, Permission, Group


class Command(BaseCommand):
    help = "Creates a new user with specified username"

    def add_arguments(self, parser):
        parser.add_argument("username", nargs="?", type=str, default=None)

    def handle(self, *args, **options):
        username = options["username"][0]
        while not username:
            self.stdout.write("Enter username:")
            username = input()
            if User.objects.filter(username=username).exists():
                self.stdout.write(
                    self.style.NOTICE(
                        "User with username '%s' already exists." % username
                    )
                )
                username = None

        password = None
        while not password:
            self.stdout.write("Enter password:")
            password = input()

        self.stdout.write("Enter email (optional):")
        email = input()
        if not email:
            email = None

        self.stdout.write("Enter first name (optional):")
        first_name = input()

        self.stdout.write("Enter last name (optional):")
        last_name = input()

        self.stdout.write("\n")

        self.stdout.write("About to create user with attributes:")
        self.stdout.write("Username: %s" % username)
        self.stdout.write("Password: %s" % password)
        self.stdout.write("e-Mail: %s" % email)
        self.stdout.write("First name: %s" % first_name)
        self.stdout.write("Last name: %s" % last_name)

        self.stdout.write("\nSave user? [y/N]")
        confirm = None
        while not confirm:
            confirm = input()
            if not confirm:
                self.stdout.write(self.style.ERROR("Aborted"))
                return
            if confirm is not "y":
                confirm = None

        user = User.objects.create_user(username, email, password)

        if first_name:
            user.first_name = first_name

        if last_name:
            user.last_name = last_name

        user.save()

        self.stdout.write("\n")

        groups = Group.objects.all()
        for g in groups:
            self.stdout.write("[%i] %s" % (g.id, g.name))

        self.stdout.write(
            "Enter the ids of the groups user should be a part of (optional):"
        )
        gno = None
        while not gno:
            try:
                gno = int(input())
                if not gno:
                    break
            except (ValueError, TypeError):
                self.stdout.write(
                    self.style.NOTICE(
                        "Invalid input. Please enter numbers like so: 123"
                    )
                )

        for d in str(gno):
            d = int(d)
            group = Group.objects.get(id=d)
            group.user_set.add(user)

        self.stdout.write(
            self.style.SUCCESS(
                'Succesfully created user with username: "%s"' % username
            )
        )
