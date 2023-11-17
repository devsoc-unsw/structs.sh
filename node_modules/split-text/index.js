"use strict";

module.exports = function (text, limit) {
  var lines = [];

  while (text.length > limit) {
    var chunk = text.substring(0, limit);
		var lastWhiteSpace = chunk.lastIndexOf(' ');

    if (lastWhiteSpace !== -1) limit = lastWhiteSpace;

		lines.push(chunk.substring(0, limit));
		text = text.substring(limit + 1);
  }

	lines.push(text);

  return lines;
}
