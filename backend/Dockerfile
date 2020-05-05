FROM python:3.6

WORKDIR /usr/src/app

RUN pip3 install django django-cors-headers django-channels django-graphql-jwt graphene-django mysqlclient mapbox coverage pymysql

COPY . .

CMD [ "python3", "./manage.py", "runserver" ]
