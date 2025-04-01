import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginateSomethingArgs {
  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  offset: number;
}
