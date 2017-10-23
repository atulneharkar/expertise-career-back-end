// expose our config directly to our application using module.exports
module.exports = {

  'facebookAuth' : {
    'clientID'      : '142550689703247', // your App ID
    'clientSecret'  : '886d87312a34546116f49a45e2f43186', // your App Secret
    'callbackURL'   : 'http://localhost:3000/user/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'    : 'vEpffhE8wqa8prVEV3hz4CeeT',
    'consumerSecret' : 'X6SRmeChDH0a2szW4hAIo0Uqd6mOfg70XH0TKDNooO2hXSpWV8',
    'callbackURL'    : 'http://localhost:3000/user/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientID'      : '448540267236-dsgkmcoe4rqjfl72lc7ognpdfg7vf4hu.apps.googleusercontent.com',
    'clientSecret'  : 'UcCFq3FF9SMPQlH0SjhmEtnB',
    'callbackURL'   : 'http://localhost:3000/user/auth/google/callback'
  },

  'githubAuth' : {
    'clientID'      : '7590e84eb3db62cf890c', 
    'clientSecret'  : '07a68658df8b3f5fc9e4dc2518d22cf6775cd5bf', 
    'callbackURL'   : 'http://localhost:3000/user/auth/github/callback'
  },

  'linkedinAuth' : {
    'consumerKey'    : '81hzsvnw4ymodh', 
    'consumerSecret' : 'LOipYZFmSEPSwRFq', 
    'callbackURL'    : 'http://localhost:3000/user/auth/linkedin/callback'
  }

};