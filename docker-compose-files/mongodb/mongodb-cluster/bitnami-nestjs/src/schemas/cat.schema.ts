import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CatDocument = HydratedDocument<Cat>;

@Schema()
@ObjectType("Cat")
export class Cat {
  @Field(() => ID)
  id: string;

  @Prop()
  @Field(() => String)
  name: string;

  @Prop({ type: [Types.ObjectId], default: [] })
  @Field(() => [String])
  something: Types.ObjectId[];
}

export const CatSchema = SchemaFactory.createForClass(Cat);
