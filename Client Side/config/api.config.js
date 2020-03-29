const isProdMode = Object.is(process.env.NODE_ENV, 'production')

module.exports = {
  baseUrl: isProdMode ? 'https://lt9mcjs3s5.execute-api.us-east-1.amazonaws.com/dev/' : 'api/'
}
