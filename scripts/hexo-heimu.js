hexo.extend.tag.register('heimu', function(args) {

  var splited = args.join(' ').split('|');

  var origin = splited[0].trim();

  var heimu = origin;
  if (splited.length > 1) {
  	heimu = splited[1].trim();
  }

  var ruby_result = "<span class=\"heimu\" title=\"" + heimu + "\">" + origin + "<span>"
  
  return ruby_result;
});
