# Mocking gRPC procedures

- We'll use [`tkpd/gripmock`](https://github.com/tokopedia/gripmock) docker image.
- We're doing static mocking here.

  - But you should know that you can also do dynamic mocking by interacting to this tool over its RESTful API.

    - ```bash
      curl -X GET localhost:4771
      ```

      To get a list of all mocked APIs.

    For a complete list take a look at [their doc](https://github.com/tokopedia/gripmock?tab=readme-ov-file#stubbing).
