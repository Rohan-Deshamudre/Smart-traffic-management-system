FROM python:3

WORKDIR /usr/src/app

RUN pip3 install django django-cors-headers django-channels django-graphql-jwt graphene-django mysqlclient mapbox coverage pymysql dicttoxml pyshp

COPY . .

CMD ["python3", "./manage.py", "test"]
