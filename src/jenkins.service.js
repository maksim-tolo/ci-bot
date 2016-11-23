const Jenkins = require('jenkins');

class JenkinsService {
  constructor({url, username, password, crumbIssuer, headers} = {}) {
    this.api = Jenkins({
      baseUrl: this.getBaseUrl(url, username, password),
      crumbIssuer,
      headers,
      promisify: true
    });
  }

  getBaseUrl(url, username, password) {
    const protocol = url.match(/http:\/\//) ? 'http://' : 'https://';

    return `${protocol}${username}:${password}@${url.replace(/https?:\/\//, '')}`;
  }

  getServerInfo() {
    return this.api.info();
  }

  getBuildInfo(jobName, buildNumber) {
    return this.api.build.get(jobName, buildNumber);
  }

  getBuildLog(jobName, buildNumber, startOffset, outputFormat, meta) {
    return this.api.build.log(jobName, buildNumber, startOffset, outputFormat, meta);
  }

  stopBuild(jobName, buildNumber) {
    return this.api.build.stop(jobName, buildNumber);
  }

  runBuild(jobName, buildOptions, token) {
    return this.api.job.build(jobName, buildOptions, token);
  }

  getJobInfo(jobName) {
    return this.api.job.get(jobName);
  }

  getListOfJobs() {
    return this.api.job.list()
  }
}

module.exports = JenkinsService;
