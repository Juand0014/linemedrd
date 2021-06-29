import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Schema as MSchema } from "mongoose";

import { User, UserDocument } from "./user.model";
import { UserService } from "./user.service";
import { CreateUserInput, UpdateUserInput, ListUserInput } from "./user.input";
import { UserAdress } from "../user-adress/user-adress.model";
import { UserPreferences } from "../user-preferences/user-preferences.model";

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  async user(@Args("_id", { type: () => String }) _id: MSchema.Types.ObjectId) {
    return this.userService.getById(_id);
  }

  @Query(() => [User])
  async users(@Args("filters", { nullable: true }) filters?: ListUserInput) {
    return this.userService.list(filters);
  }

  @Mutation(() => User)
  async createUser(@Args("payload") payload: CreateUserInput) {
    return this.userService.create(payload);
  }

  @Mutation(() => User)
  async updateUser(@Args("payload") payload: UpdateUserInput) {
    return this.userService.update(payload);
  }

  @Mutation(() => User)
  async deleteUser(
    @Args("_id", { type: () => String }) _id: MSchema.Types.ObjectId
  ) {
    return this.userService.delete(_id);
  }

  @ResolveField()
  async user_adress(
    @Parent() user: UserDocument,
    @Args("populate") populate: boolean
  ) {
    if (populate)
      await user
        .populate({ path: "userAdress", model: UserAdress.name })
        .execPopulate();
    return user.userAdress;
  }

  @ResolveField()
  async user_preferences(
    @Parent() user: UserDocument,
    @Args("populate") populate: boolean
  ) {
    if (populate)
      await user
        .populate({
          path: "userPreferences",
          model: UserPreferences.name,
        })
        .execPopulate();
    return user.userPreferences;
  }
}
