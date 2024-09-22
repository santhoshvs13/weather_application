# weather_application
Weather Application 

# Backend Django REST framework setup 
- git clone -m <reponame>
- create a vitrual environment 
python3 -m venv env
source env/bin/activate  # On Windows use `env\Scripts\activate`
- pip install -r requirements.txt
- python manage.py runserver

# Frontend React+vite 
- install node module
- npm create vite@latest <my-react-app> -- --template react
- cd my-react-app
- npm install
- npm install <mentioned package json modules like: axios, chart.js, react-chartjs-2, react , react-data-table-component, react-dom, react-modal etc>
- npm run dev

After successfull login will get live weather application to serach gobally with default search value for Coimabtore city.
And need configuration for the favourites and trends and average calculations

# configuration
- Once UI pahge open you get 2 options Home and Favourites 
- In the favourites add your favourites
- Run the celery and celery beat for the backgorund jobs to fetch the trend data hour wise for the avg 24 hrs and graph mapping.
- cmds for celery andcelery below
- celery -A your_project_name worker --loglevel=info
- celery -A your_project_name beat --loglevel=info
