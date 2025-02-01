# topic-nestjs

Here we are showing how you can use topic in RabbitMQ with `@golevelup/nestjs-rabbitmq` library.

> [!IMPORTANT]
>
> Although here in [`./src/rabbitmq/rabbitmq.config.ts`](./src/rabbitmq/rabbitmq.config.ts) file we are specifying how each routing key should be routed; to which queue. But keep in mind that if you configure it differently where you are using `@RabbitRPC` decorator or `@RabbitSubscribe` it is gonna take precedence (I am not sure if we can use the word, "precedence" though, I mean it might be overwritten or something else). What I am trying to say is that the following code would configure our `user.send_deregistration_email` queue to receive messages with this routing key: `user.created`:
>
> `rabbitmq.config.ts`
>
> ```ts
> // ...
> queues: [
>   // ...
>   {
>     name: USER_DEREGISTRATION_MAIL_QUEUE,
>     routingKey: USER_DELETED_ROUTING_KEY,
>     createQueueIfNotExists: true,
>   },
>   {
>     name: USER_WELCOME_MAIL_QUEUE,
>     routingKey: USER_CREATED_ROUTING_KEY,
>     createQueueIfNotExists: true,
>   },
>   // ...
> ],
> // ...
> ```
>
> `rabbitmq.service.ts`:
>
> ```ts
> // ...
> @RabbitRPC({
>   exchange: TOPIC_EXCHANGE,
>   queue: USER_DEREGISTRATION_MAIL_QUEUE,
>
>   // Pay attention to the following misconfiguration!
>   routingKey: USER_CREATED_ROUTING_KEY,
>
> })
> async partingGift(@RabbitPayload() payload: string) {
>   // ...
> }
> ```

## Docker compose

We are using docker to bootstrap and run a rabbitmq instance.

## Run in dev mode

1. `cp .env.example .env`.hat if
2. `pnpm install`.
3. `docker compose up -d`.
4. `pnpm start:dev`.
5. Go to [localhost:3000/docs](localhost:3000/docs). If you've change the `PORT` env value please change it here too.
6. Send requests to endpoints and check the logs in your terminal.
