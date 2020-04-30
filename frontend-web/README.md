### Instruction to run
To start the app in development mode:
1. `npm install`
2. `npm start`












# Mapbox3D With Decision Tree integration


## Development workflow:

* always branch off of master branch
* no commits in master or any other branch that you do not work on
* single branch needs to have only commits by a owner

## Standards and pointers

* classes should not be longer than 300 LOC
* methods should not be longer than 30 LOC
* all architecture needs to be fully decoupled
* for important external libraries create a service / api wrapper in order to be able to have a decoupled interface to that external lib
* Stick to DRY principles by any means
* commit your code as often as possible [please, please keep commit diffs as small as possbile]
* push your code at least once a day
* if you get stuck for >3h by not being able to solve a problem, ping your trainer => do not waste time!
* do not add huge libraries as a core dependency to solve a problem that can be solved in one custom class
* base your implemention on design patterns => do not reinvent the wheel poorly
* HAVE FUN :)
