const SERVER_INFO = {
  "assignedLabels": [
    {}
  ],
  "description": null,
  "jobs": [
    {
      "color": "blue",
      "name": "example",
      "url": "http://localhost:8080/job/example/"
    }
  ],
  "mode": "NORMAL",
  "nodeDescription": "the master Jenkins node",
  "nodeName": "",
  "numExecutors": 2,
  "overallLoad": {},
  "primaryView": {
    "name": "All",
    "url": "http://localhost:8080/"
  },
  "quietingDown": false,
  "slaveAgentPort": 12345,
  "unlabeledLoad": {},
  "useCrumbs": false,
  "useSecurity": false,
  "views": [
    {
      "name": "All",
      "url": "http://localhost:8080/"
    }
  ]
};

const SERVER_INFO_ERROR = {
  message: 'Server connection failure'
};

const BUILD_INFO = {
  "actions": [],
  "buildable": true,
  "builds": [
    {
      "number": 1,
      "url": "http://localhost:8080/job/example/1/"
    }
  ],
  "color": "blue",
  "concurrentBuild": false,
  "description": "",
  "displayName": "example",
  "displayNameOrNull": null,
  "downstreamProjects": [],
  "firstBuild": {
    "number": 1,
    "url": "http://localhost:8080/job/example/1/"
  },
  "healthReport": [
    {
      "description": "Build stability: No recent builds failed.",
      "iconUrl": "health-80plus.png",
      "score": 100
    }
  ],
  "inQueue": false,
  "keepDependencies": false,
  "lastBuild": {
    "number": 1,
    "url": "http://localhost:8080/job/example/1/"
  },
  "lastCompletedBuild": {
    "number": 1,
    "url": "http://localhost:8080/job/example/1/"
  },
  "lastFailedBuild": null,
  "lastStableBuild": {
    "number": 1,
    "url": "http://localhost:8080/job/example/1/"
  },
  "lastSuccessfulBuild": {
    "number": 1,
    "url": "http://localhost:8080/job/example/1/"
  },
  "lastUnstableBuild": null,
  "lastUnsuccessfulBuild": null,
  "name": "example",
  "nextBuildNumber": 2,
  "property": [],
  "queueItem": null,
  "scm": {},
  "upstreamProjects": [],
  "url": "http://localhost:8080/job/example/"
};

const JOB_INFO = {
  "actions": [],
  "buildable": true,
  "builds": [
    {
      "number": 1,
      "url": "http://localhost:8080/job/example/1/"
    }
  ],
  "color": "blue",
  "concurrentBuild": false,
  "description": "",
  "displayName": "example",
  "displayNameOrNull": null,
  "downstreamProjects": [],
  "firstBuild": {
    "number": 1,
    "url": "http://localhost:8080/job/example/1/"
  },
  "healthReport": [
    {
      "description": "Build stability: No recent builds failed.",
      "iconUrl": "health-80plus.png",
      "score": 100
    }
  ],
  "inQueue": false,
  "keepDependencies": false,
  "lastBuild": {
    "number": 1,
    "url": "http://localhost:8080/job/example/1/"
  },
  "lastCompletedBuild": {
    "number": 1,
    "url": "http://localhost:8080/job/example/1/"
  },
  "lastFailedBuild": null,
  "lastStableBuild": {
    "number": 1,
    "url": "http://localhost:8080/job/example/1/"
  },
  "lastSuccessfulBuild": {
    "number": 1,
    "url": "http://localhost:8080/job/example/1/"
  },
  "lastUnstableBuild": null,
  "lastUnsuccessfulBuild": null,
  "name": "example",
  "nextBuildNumber": 2,
  "property": [],
  "queueItem": null,
  "scm": {},
  "upstreamProjects": [],
  "url": "http://localhost:8080/job/example/"
};

const JOBS_LIST = [
  {
    "color": "blue",
    "name": "example",
    "url": "http://localhost:8080/job/example/"
  }
];

const VALID_PASSWORD = '123456';

class JenkinsService {
  constructor({url, username, password}) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.isConnected = this.password === VALID_PASSWORD;
  }

  getServerInfo() {
    return this.isConnected ? Promise.resolve(SERVER_INFO) : Promise.reject(SERVER_INFO_ERROR);
  }

  getBuildInfo() {
    return Promise.resolve(BUILD_INFO);
  }

  getJobInfo() {
    return Promise.resolve(JOB_INFO);
  }

  getListOfJobs() {
    return Promise.resolve(JOBS_LIST);
  }
}

module.exports = JenkinsService;
