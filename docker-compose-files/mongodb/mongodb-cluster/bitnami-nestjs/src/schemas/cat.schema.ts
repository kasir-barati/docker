import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CatDocument = HydratedDocument<Cat>;

@Schema({ collection: "yourcats" }) // This is overridden by the AppModule configuration
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
