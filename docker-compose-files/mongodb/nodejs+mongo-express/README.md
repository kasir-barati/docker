# General info

- Connection string: `mongodb://docker:student@localhost:27017/learning?authSource=admin`

# How to start the compose file

1. `cp .env.example .env`
2. `docker-compose up`

# How to stop and delete all the MongoDB information

1. `docker-compose down --remove-orphans`

# Error: Authentication failed.

- What I've tried to find the problem:
  - Googling: I reached [this Stackoverflow Q&A](https://stackoverflow.com/questions/60394290) and followed this steps:
    - Clean state
      - `docker volume prune`
      - `docker-compose down --remove-orphans`
      - Then exec into container: `docker exec -it anime_die_heart_mongodb bash`
        - `mongo -u python -p student`
        - `mongo -u python -p student --authenticationDatabase anime_videos`
        - `mongo -u python -p student --authenticationDatabase admin`
      - **FAILED**
        - Passed env:
          - `MONGODB_USERNAME=docker`
          - `MONGODB_PASSWORD=student`
          - `MONGODB_DATABASE=learning`
    - Used both different way to pass env to the container:
      - `env_file`
      - `environment`
      - Then exec into container: `docker exec -it anime_die_heart_mongodb bash`
        - `mongo -u python -p student`
        - `mongo -u python -p student --authenticationDatabase anime_videos`
      - **FAILED**
        - Passed env:
          - `MONGODB_USERNAME=docker`
          - `MONGODB_PASSWORD=student`
          - `MONGODB_DATABASE=learning`
    - Use different env set:
      - First set:
        - `MONGO_INITDB_ROOT_USERNAME=python`
        - `MONGO_INITDB_ROOT_PASSWORD=student`
        - `MONGO_INITDB_DATABASE=anime_videos`
      - Then exec into container: `docker exec -it anime_die_heart_mongodb bash`
        - `mongo -u python -p student`
        - `mongo -u python -p student --authenticationDatabase anime_videos`
      - **FAILED**
      - Second set:
        - `MONGODB_USERNAME=docker`
        - `MONGODB_PASSWORD=student`
        - `MONGODB_DATABASE=learning`
      - Then exec into container: `docker exec -it anime_die_heart_mongodb bash`
        - `mongo -u python -p student`
        - `mongo -u python -p student --authenticationDatabase anime_videos`
        - `mongo -u python -p student --authenticationDatabase admin`
      - **FAILED**
    - Finally I put these envs in `.mongodb.env` and remove `environment` instruction from the compose file.
      - `MONGO_INITDB_ROOT_USERNAME=python`
      - `MONGO_INITDB_ROOT_PASSWORD=student`
      - `MONGO_INITDB_DATABASE=anime_videos`
      - Then exec into container: `docker exec -it anime_die_heart_mongodb bash`
      - `mongo -u python -p student --authenticationDatabase admin`
      - **Worked**
        - #### Recently I realized that if I am using another file name - e.x. `dev.docker-compose.yml` - I need to set the `env_file` in the yaml file. Otherwise it won't create user and you'll get the Authentication failed error for the rest of the eternity :joy:
