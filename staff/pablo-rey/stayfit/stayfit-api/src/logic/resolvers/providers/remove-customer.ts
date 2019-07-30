import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { ValidationError } from '../../../common/errors';
import { MyContext } from '../../middleware/MyContext';
import { Provider, ProviderModel } from '../../../data/models/provider';
import { UserModel } from '../../../data/models/user';
import { ONLY_ADMINS_OF_PROVIDER } from '../../middleware/authChecker';

@Resolver(Provider)
export class RemoveProviderCustomerResolver {
  /**
   * Remove this user from the provider
   * 
   * @param providerId 
   * @param userId 
   * @param ctx 
   */
  @Authorized(ONLY_ADMINS_OF_PROVIDER)
  @Mutation(returns => Boolean)
  async removeProviderCustomer(
    @Arg('providerId') providerId: string,
    @Arg('userId') userId: string,
    @Ctx() ctx: MyContext
  ) {
    const user = await UserModel.findById(userId);
    if (!user) throw new ValidationError('user is required');

    const provider = await ProviderModel.findById(providerId);
    if (!provider) throw new ValidationError('provider is required')
    if (!provider.customers.includes(user.id)) return false;
    provider!.customers = provider!.customers.filter(customer => customer.toString() !== userId);
    await provider!.save();
    user.customerOf = user.customerOf.filter(p => p.toString() !== provider.id);
    await user.save();
    return true;
  }
}
