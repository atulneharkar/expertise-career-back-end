import applicationPrivateConfig from './config.json';

const applicationPublicConfig = {
  'development': {
    "API_URL": "https://skillunfold.com:8080"
  },
  "stage": {
    "API_URL": "https://skillunfold.com:8080" 
  },
  'production': {
    "API_URL": "https://skillunfold.com:8080" 
  }
};

/**
 * common configuration
 * same across all environment
 */
const commonConfigAcrossAllEnv = {
  'OTP_EXPIRY_TIME': 2, /* in hours */
  'REDIS_KEY': 'skillunfold:' /* unique seperator to distinguish redis key */
};

/**
 * get environment specific config - default: development
 * this is private configuration - not tracked in git
 */
const runtimePrivateConfig = applicationPrivateConfig[process.env.NODE_ENV || 'development'];

/**
 * get environment specific config - default: development
 * this is public configuration available in git
 */
const runtimePublicConfig = applicationPublicConfig[process.env.NODE_ENV || 'development'];

/* combine both */
const config = Object.assign({}, runtimePrivateConfig, runtimePublicConfig, commonConfigAcrossAllEnv);

export default config;
