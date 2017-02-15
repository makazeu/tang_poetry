var db_config = {
  host     : 'localhost',
  user     : 'Your Username',
  password : 'Your Password',
  database : 'tang_poetry',
  port     : 3306
};

exports.getDatabseConfig = function() {
    return db_config;
}
