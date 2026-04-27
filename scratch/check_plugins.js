const softDeletePlugin = require('soft-delete-plugin-mongoose');
const autopopulate = require('mongoose-autopopulate');

console.log('softDeletePlugin type:', typeof softDeletePlugin);
console.log('softDeletePlugin keys:', Object.keys(softDeletePlugin));
console.log('autopopulate type:', typeof autopopulate);
console.log('autopopulate keys:', Object.keys(autopopulate));
