var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pokeDataUtil = require("./poke-data-util");
var _ = require("underscore");
var app = express();
var PORT = 3000;

// Restore original data into poke.json. 
// Leave this here if you want to restore the original dataset 
// and reverse the edits you made. 
// For example, if you add certain weaknesses to Squirtle, this
// will make sure Squirtle is reset back to its original state 
// after you restard your server. 
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable. 
var _DATA = pokeDataUtil.loadData().pokemon;

/// Setup body-parser. No need to touch this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
		var contents = "";
		_.each(_DATA, function(i) {
			contents += '<tr><td>' + i.id + '</td><td><a href="/pokemon/' +i.id + '">' + i.name + '</a></td></tr>\n';
		});
		var html = '<html><body><table>'+ contents + '</table></body></html>';
    res.send(html);
});

app.get("/pokemon/:pokemon_id", function(req, res) {
		var contents = "";
		var _id = parseInt(req.params.pokemon_id);
		var result = _.findWhere(_DATA, {id:_id});
		if (result) {
			for (var key in result) {
				contents += '<tr><td>'+key+'</td><td>'+JSON.stringify(result[key])+'</td></tr>\n';
			}
		} else {
			contents="{}";
		}
		var html = '<html><body><table>'+ contents + '</table></body></html>';
    res.send(html);
});

app.get("/pokemon/image/:pokemon_id", function(req, res) {
    var contents = "";
		var _id = parseInt(req.params.pokemon_id);
		var result = _.findWhere(_DATA, {id:_id});
		contents += '<image src="' + result.img +'"/>';
		var html = '<html><body>'+ contents + '</body></html>';
    res.send(html);
});

app.get("/api/id/:pokemon_id", function(req, res) {
    // This endpoint has been completed for you.  
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({});
    res.json(result);
});

app.get("/api/evochain/:pokemon_name", function(req, res) {
    var contents = [];
		var _name = req.params.pokemon_name;
		_name = _name.charAt(0).toUpperCase() + _name.slice(1);
		//if (!_name) return res.json({});
		var result = _.findWhere(_DATA, {name:_name});
		if (result) {
			if (result.prev_evolution)
				contents = contents.concat(_.pluck(result.prev_evolution, 'name'));
			contents.push(result.name);
			if (result.next_evolution)
				contents = contents.concat(_.pluck(result.next_evolution, 'name'));
		}
    res.json(contents);
});

app.get("/api/type/:type", function(req, res) {
    var contents = [];
		var _type = req.params.type;
		_type = _type.charAt(0).toUpperCase() + _type.slice(1);
		var result = _.filter(_DATA, function(obj) {
			return obj.type.indexOf(_type)>=0;
		});
		if (!result) return res.json(contents);
		contents = contents.concat(_.pluck(result, 'name'));
		res.json(contents);
});

app.get("/api/type/:type/heaviest", function(req, res) {
    var contents = [];
		var _type = req.params.type;
		_type = _type.charAt(0).toUpperCase() + _type.slice(1);
		var result = _.filter(_DATA, function(obj) {
			return obj.type.indexOf(_type)>=0;
		});
		if (!result || result.length==0) return res.json({});
		var largest = {};
		var fatty = _.max(result, function(obj) {
			if (obj)
				return parseInt(obj.weight.substr(0,obj.weight.length-2));
			return 0;
			});
		if (fatty) {
			largest.name = fatty.name
			largest.weight = parseInt(fatty.weight.substr(0,fatty.weight.length-2));
			res.json(largest);
		} else {
			res.json({});
		}
});

app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
		var _name = req.params.pokemon_name;
		var result = _.findWhere(_DATA, {name:_name});
		var _weakness = req.params.weakness_name;
		if (!result) return res.json({});
		if (result.weaknesses.indexOf(_weakness) == -1) {
			result.weaknesses.push(_weakness);
		}
		pokeDataUtil.saveData(_DATA)
		var change = {};
		change.name = result.name;
		change.weaknesses = result.weaknesses;
		res.json(change);
});

app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
    var _name = req.params.pokemon_name;
		var result = _.findWhere(_DATA, {name:_name});
		var _weakness = req.params.weakness_name;
		if (!result) return res.json({});
		var index = result.weaknesses.indexOf(_weakness);
		if (index != -1) {
			result.weaknesses.splice(index, 1);
		}
		pokeDataUtil.saveData(_DATA)
		var change = {};
		change.name = result.name;
		change.weaknesses = result.weaknesses;
		res.json(change);
});


// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
