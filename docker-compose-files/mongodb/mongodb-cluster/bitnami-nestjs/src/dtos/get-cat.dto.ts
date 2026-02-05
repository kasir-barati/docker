import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class GetCatArgs {
  @Field()
  name: string;
}
