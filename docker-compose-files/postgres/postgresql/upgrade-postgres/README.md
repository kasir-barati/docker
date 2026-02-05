# How we should upgrade our database?

- Containers meant to be disposable:
  - Immutable :arrow_right: Unchanging
  - Ephemeral :arrow_right: Temporary
- Throw away container and create a new one without data lost concern should be our way
- Immutable infrastructure:
  - We do not change thing while they are running
  - Redeploy a whole new container if you need to change something, either a config, or code
  - In this way we have:
    - Reliability
    - Consistency
    - Reproducible changes
- For unique data that our apps generate:
  - Unique data examples: Log, Keys, Database data, etc
  - Follow separation of concerns approach:
    - Do not save unique data inside container
    - Inside the container just our app binaries
  - Two solution:
    - Data volume:

      ```yml
      version: "3.8"

      services:
        postgres:
          volumes:
            - postgres:/var/lib/postgresql/data/pgdata
      volumes:
        postgres:
      ```

      Or

      ```yml
      version: "3.8"

      services:
        postgres:
          volumes:
            - type: volume
              source: postgres
              target: /var/lib/postgresql/data/pgdata
      volumes:
        postgres:
      ```

      TBH ATM IDK what is the difference and my gut tells me they are equivalent

    - Bind mount:

      In this way we are mounting a directory from our host inside the container

      ```yml
      version: "3.8"

      services:
        postgres:
          volumes:
            - type: bind
              source: /path/to/pgdata
              target: /var/lib/postgresql/data/pgdata
              volume:
                nocopy: true
      ```

- A very simple but important rule: **WE DO NOT DO MAJOR UPGRADES BY JUST CHANGING THE BASE IMAGE**. It can cause a lot of trouble. But it is OK to do patch upgrades as I did in this example.
