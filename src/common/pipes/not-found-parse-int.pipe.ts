import {
  Injectable,
  ParseIntPipe,
  NotFoundException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class NotFoundParseIntPipe extends ParseIntPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      // Use the default ParseIntPipe functionality
      return await super.transform(value, metadata);
    } catch {
      // Return not found exception
      throw new NotFoundException(
        `The requested resource with ID '${value}' was not found`,
      );
    }
  }
}
