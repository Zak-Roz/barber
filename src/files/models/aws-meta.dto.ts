import { ApiProperty } from '@nestjs/swagger';

export class AwsMetaDto {
  @ApiProperty({ type: () => Object, required: true })
  readonly formData: { [key: string]: any };

  @ApiProperty({ type: () => String, required: true })
  readonly url: string;

  constructor(awsResponse: { [key: string]: any }) {
    this.formData = awsResponse.fields;
    this.formData.key = awsResponse.key;
    this.formData.acl = awsResponse.acl;
    this.formData['Content-Type'] = awsResponse.contentType;
    this.url = awsResponse.url;
  }
}
