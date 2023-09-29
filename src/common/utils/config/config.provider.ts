import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const provideConfig = async () => {
  const nodeEnv = process.env.NODE_ENV;
  const envFilePath =
    nodeEnv === 'dev' || nodeEnv === 'local'
      ? path.resolve(`./.env.${nodeEnv}`)
      : path.resolve(`/opt/nodejs/.env.${nodeEnv}`);

  return dotenv.parse(fs.readFileSync(envFilePath));
};

export const configProvider = {
  provide: 'CONFIG',
  useFactory: provideConfig,
};
