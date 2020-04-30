# scenwise_backend

##### Backend for Scenwise BEP

###### How to run the server:

`python manage.py runserver` or `python3 manage.py runserver`

`daphne --ws-protocol "graphql-ws" --proxy-headers scenwise_backend.asgi:channel_layer` and `python3 manage.py runworker`

pycodestyle --exclude='venv/*','requirements.txt','README.md','docs/*','opendata/*','settings.py' *

###### How to create a new endpoint:
1. <span id="one">Create a table (i.e. `car`) in MySQL using snake case</span>
2. Create a _car**s**_ package in api map
3. Create `api/cars/models.py` in the map extending from the `api/abstract_model.py`.
    0. <span id="threeDotZero">Create a **Car** model in `api/cars/models.py`
     (_with the same name as the table but in pascal case_)</span>
    1. Define al its columns
    2. Handle foreign keys (i.e. `car`.`owner_id` = `owner`.`id`), by linking the models of the foreign key tables.
        1. If the model does not exist (i.e. `car`.`tire_set_id` = `car_tire_set`.`id`), start from <a href="#one">1</a> and skip until <a href="#threeDotZero">3.i</a> with **CarTireSet**
4. Create `api/cars/schema.py` in the map *cars*
    0. Create a **DjangoObjectType** for every model in `api/cars/models.py`
    1. Create a **Query** and/or **Mutation** class
5. Import `api/cars/schema.py` in `api/api_schema.py`
    0. Include created **Query** and/or **Mutation** class
6. Include _api.cars_ in `settings.py` under **INSTALLED_APPS** section
7. When using multiple DBs, adjust `dbrouter.py` according to what DB is used in the _api.cars_

###### Update documentation:
1.  `pip install Sphinx`
2. Update docstrings in python files
3. `make html` in docs folder

###### Run tests:
- To run tests: `python manage.py test`
- To install test coverage: `pip install coverage`
    - To run test coverage: `coverage run manage.py test -v`
    - To print test coverage: `coverage html`