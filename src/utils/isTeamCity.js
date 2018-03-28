function isTeamCity() {
  return process.env.BUILD_NUMBER || process.env.TEAMCITY_VERSION;
}

module.exports = isTeamCity;
