import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './schemas/cat.schema';
import { Model, Types } from 'mongoose';
import { PaginateSomethingArgs } from './dtos/paginate-something.dto';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async onModuleInit() {
    if (await this.catModel.exists({ name: 'Tom' })) {
      return;
    }

    await this.catModel.create({
      name: 'Tom',
      something: new Array(100_000).fill(null).map(() => new Types.ObjectId()),
    });

    this.logger.log('Tom created');
  }

  async getCat(name: string) {
    const cat = await this.catModel
      .findOne({ name })
      .select({ _id: 1, name: 1 })
      .exec();

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return {
      id: cat._id.toString(),
      name: cat.name,
    };
  }

  async getSomething(
    id: string,
    args: PaginateSomethingArgs,
  ): Promise<string[]> {
    const cat = await this.catModel
      .aggregate<Cat>([
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $project: {
            something: { $slice: ['$something', args.offset, args.limit] },
          },
        },
      ])
      .exec();

    return cat[0].something.map(String);
  }
}
