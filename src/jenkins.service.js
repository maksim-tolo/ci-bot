const Jenkins = require('jenkins');

class JenkinsService {
  constructor({baseUrl, crumbIssuer, headers} = {}) {
    this.api = Jenkins({
      baseUrl,
      crumbIssuer,
      headers,
      promisify: true
    });
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
