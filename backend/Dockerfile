FROM python:3

WORKDIR /usr/src/app

RUN pip3 install django graphene-django django-cors-headers django-channels django-graphql-jwt mysqlclient mapbox

COPY . .

CMD [ "python", "./manage.py", "runserver" ]