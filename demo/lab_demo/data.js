var fs = require('dfs');

// data
var content = fs.readFileSync('./lab.json');
// fake the IPython.display.JSON object
var out = {}
out['content'] = {}
out.content['data'] = {}
out.content.data['application/json'] = content;

module.exports = out;
