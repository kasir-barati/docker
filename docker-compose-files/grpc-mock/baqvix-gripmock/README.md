> [!NOTE]
>
> So far I have not faced some critical issue with this one. BTW do not forget to support us by giving us a star on GitHub.

> [!TIP]
>
> IDK why but in one machine I could use this syntax in my compose file and it was working just fine:
> ```yml
> command: |
>   --stub=/stubs \
>   --imports=/proto \
>   /proto/user/user.proto /proto/common/address.proto
> ```
> but in another machine I had to use this one:
> ```yml
> command: --stub=/stubs --imports=/proto /proto/user/user.proto /proto/common/address.proto
> ```

## Ref

- Documentation: [gripmock](https://gripmock.org).
- GitHub repo: [bavix/gripmock](https://github.com/bavix/gripmock).
