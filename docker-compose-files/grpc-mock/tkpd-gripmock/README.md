> [!CAUTION]
>
> This docker image is really behind and is not maintained properly. I just faced another issue, `repeated` fields ain't supported ([ref](https://github.com/tokopedia/gripmock/issues/76))! So I guess I am just gonna keep this here as some sort of heads up.

> [!TIP]
>
> I highly suggest to you to [use this](../ciena-grpc-mock) as a **good alternative**.

# Mocking gRPC procedures

> [!CAUTION]
>
> I banged my head against brick wall since I was getting this error message in my Terminal:
>
> ```bash
> Can't find stub
> ```
>
> The reason was because of my mock files. So I had to use something like this in order to get it working in some instances:
>
> ```diff
>  {
>    "service": "TestService",
>    "method": "GetTest",
> +  "input": { "matches": {} },
>    "output": { "data": { "name": "Something" } }
>  }
> ```
>
> **Note**: this is only the case when you do not expect any form of input from the caller.

- We'll use [`tkpd/gripmock`](https://github.com/tokopedia/gripmock) docker image.
- We're doing static mocking here.

  - But you should know that you can also do dynamic mocking by interacting to this tool over its RESTful API.

    - ```bash
      curl -X GET localhost:4771
      ```

      To get a list of all mocked APIs.

    For a complete list take a look at [their doc](https://github.com/tokopedia/gripmock?tab=readme-ov-file#stubbing).

- Here I also added an example (`compose2.yml`) of mocking different services with this while the default compose file will mock everything in one container.

## Ref

&mdash; [Ref](https://mannes.tech/gripmock/)
