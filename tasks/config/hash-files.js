/**
 * Dependencies
 */


module.exports = function(grunt) {

  grunt.config.set('hash', {
    options: {
      flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
      hashLength: 8, // hash length, the max value depends on your hash function
      hashFunction: function(source, encoding){ // default is md5
        return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
      }
    },
    js: {
      src: '.tmp/public/min/*.js',  //all your js that needs a hash appended to it
      dest: '.tmp/public/hash/' //where the new files will be created
    },
    css: {
      src: '.tmp/public/min/*.css',  //all your css that needs a hash appended to it
      dest: '.tmp/public/hash/' //where the new files will be created
    }
  });

  grunt.loadNpmTasks('grunt-hash');
};
