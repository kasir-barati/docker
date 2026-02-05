import { AppService } from "./app.service";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Cat } from "./schemas/cat.schema";
import { GetCatArgs } from "./dtos/get-cat.dto";
import { PaginateSomethingArgs } from "./dtos/paginate-something.dto";

@Resolver(() => Cat)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => Cat)
  getCat(@Args({ type: () => GetCatArgs }) { name }: GetCatArgs): Promise<{
    id: string;
    name: string;
  }> {
    return this.appService.getCat(name);
  }

  @ResolveField(() => [String])
  async something(
    @Parent() cat: Cat,
    @Args({ type: () => PaginateSomethingArgs })
    args: PaginateSomethingArgs,
  ): Promise<string[]> {
    return this.appService.getSomething(cat.id, args);
  }
}
