> [!NOTE]
>
> So far I have not faced some critical issue with this one. BTW do not forget to support us by giving us a star on GitHub.

> [!TIP]
>
> IDK why but in one machine I could use this syntax in my compose file and it was working just fine:
>
> ```yml
> command: |
>   --stub=/stubs \
>   --imports=/proto \
>   /proto/user/user.proto /proto/common/address.proto
> ```
>
> but in another machine I had to use this one:
>
> ```yml
> command: --stub=/stubs --imports=/proto /proto/user/user.proto /proto/common/address.proto
> ```

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

## Ref

- Documentation: [gripmock](https://gripmock.org).
- GitHub repo: [bavix/gripmock](https://github.com/bavix/gripmock).
